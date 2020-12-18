import Loading from './components/Loading';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Cookies, { CookieSetOptions } from 'universal-cookie';
import './App.scss';
import { debug, fetchUser, useQuery, User } from './utils';

const Home = lazy(() => import('./pages/Home'));
const Admin = lazy(() => import('./pages/Admin'));
const GuildDashboard = lazy(() => import('./pages/GuildDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Webhook = lazy(() => import('./pages/Webhook'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Footer = lazy(() => import('./components/Footer'));
const Header = lazy(() => import('./components/Header'));

const App: React.FC = () => {
	const query = useQuery();
	const [loaded, setLoaded] = useState(false);
	const [user, setUser] = useState<User | null>(null);

	// Load user
	useEffect(() => {
		fetchUser()
			.then(setUser)
			.catch(debug)
			.finally(() => setLoaded(true));
	}, []);

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

		const redirect = localStorage.getItem('redirect') || '/';
		localStorage.removeItem('redirect');
		location.href = redirect;
		return null;
	} else if (!loaded) return <Loading />;

	return (
		<Suspense fallback={<Loading />}>
			{query.get('noheader') === null && <Header user={user} />}
			<Switch>
				<Route
					exact
					path="/dashboard/:guildId"
					children={<GuildDashboard user={user} />}
				/>
				<Route exact path="/dashboard" children={<Dashboard user={user} />} />
				<Route exact path="/admin" children={<Admin user={user} />} />
				<Route exact path="/webhook" component={Webhook} />
				<Route exact path="/" component={Home} />

				<NotFound />
			</Switch>
			<Footer />
		</Suspense>
	);
};

export default App;
