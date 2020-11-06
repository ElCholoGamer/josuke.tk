import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Cookies, { CookieSetOptions } from 'universal-cookie';
import './App.scss';
import Loading from 'components/Loading';
import { debug, fetchUser, useQuery, User } from './utils';

const Home = React.lazy(() => import('./pages/Home'));
const Admin = React.lazy(() => import('./pages/Admin'));
const GuildDashboard = React.lazy(() => import('./pages/GuildDashboard'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const Webhook = React.lazy(() => import('./pages/Webhook'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Footer = React.lazy(() => import('components/Footer'));
const Header = React.lazy(() => import('components/Header'));

const App: React.FC = () => {
	const [loaded, setLoaded] = React.useState(false);
	const [user, setUser] = React.useState<User | null>(null);

	// Load user
	React.useEffect(() => {
		fetchUser()
			.then(setUser)
			.catch(debug)
			.finally(() => setLoaded(true));
	}, []);

	const query = useQuery();
	const accessToken = query.get('access_token');
	const refreshToken = query.get('refresh_token');
	const expires = query.get('expires_in');

	if (accessToken && refreshToken && expires) {
		const cookies = new Cookies();
		const options: CookieSetOptions = { path: '/', sameSite: true };

		cookies.remove('access_token');
		cookies.remove('refresh_token');

		cookies.set('access_token', accessToken, {
			...options,
			expires: new Date(Date.now() + parseInt(expires) * 1000),
		});
		cookies.set('refresh_token', refreshToken, options);
		window.location.href = window.localStorage.getItem('redirect') || '/';
		return null;
	} else if (!loaded) return <Loading />;

	return (
		<React.Suspense fallback={<Loading />}>
			<Header user={user} />
			<Switch>
				<Route
					exact
					path="/dashboard/:guildId"
					component={() => <GuildDashboard user={user} />}
				/>
				<Route
					exact
					path="/dashboard"
					component={() => <Dashboard user={user} />}
				/>
				<Route exact path="/admin" component={() => <Admin user={user} />} />
				<Route exact path="/webhook" component={Webhook} />
				<Route exact path="/" component={Home} />

				{/* <Redirect to="/" /> */}
				<Route path="/*" component={NotFound} />
			</Switch>
			<Footer />
		</React.Suspense>
	);
};

export default App;
