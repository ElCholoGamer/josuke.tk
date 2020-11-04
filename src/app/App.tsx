import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import Cookies, { CookieSetOptions } from 'universal-cookie';
import './App.scss';
import Loading from './Components/Loading';
import { fetchUser, useQuery, User } from './utils';

const Home = lazy(() => import('./Pages/Home'));
const Admin = lazy(() => import('./Pages/Admin'));
const GuildDashboard = lazy(() => import('./Pages/Dashboard/GuildDashboard'));
const NotFound = lazy(() => import('./Pages/NotFound'));
const Webhook = lazy(() => import('./Pages/WebHook'));
const Footer = lazy(() => import('./Components/Footer'));
const Dashboard = lazy(() => import('./Pages/Dashboard'));
const Header = lazy(() => import('./Components/Header'));

const App: React.FC = () => {
	const [loaded, setLoaded] = React.useState(false);
	const [user, setUser] = React.useState<User | null>(null);

	// Load user
	React.useEffect(() => {
		fetchUser()
			.then(setUser)
			.catch(console.error)
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
		<Suspense fallback={<Loading />}>
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
		</Suspense>
	);
};

export default App;
