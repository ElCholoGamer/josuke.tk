import RickRoll from 'assets/video/admin.mp4';
import axios from 'axios';
import React from 'react';
import Cookies from 'universal-cookie';
import { debug, User } from '../../utils';
import './Admin.scss';
import Counter from './Counter';

interface Stats {
	points: number;
	server_count: number;
}

interface Props {
	user: User | null;
}

const Admin: React.FC<Props> = ({ user }) => {
	const [stats, setStats] = React.useState<Stats | undefined>(undefined);
	const [loaded, setLoaded] = React.useState(false);

	React.useEffect(() => {
		if (!user?.admin) return;
		let mounted = true;

		// Get password
		const cookies = new Cookies();
		const password =
			cookies.get('admin') ||
			(() => {
				let pass;
				while (!pass) pass = prompt('Enter the admin password:');
				return pass;
			})();

		// Replace with new password
		cookies.remove('admin');
		cookies.set('admin', password, {
			path: '/',
			sameSite: true,
			expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		});

		(async () => {
			try {
				const res = await axios.get('/api/admin/stats', {
					headers: { Authorization: password },
				});

				if (res.status === 403) throw new Error('Invalid password');
				else if (mounted) setStats(res.data);
			} catch (err) {
				cookies.remove('admin');
				debug(err);
			} finally {
				setLoaded(true);
			}
		})();

		return () => {
			mounted = false;
		};
	}, [user]);

	document.title = 'Admin';
	if (!user?.admin) return <video src={RickRoll} controls={false} autoPlay />;
	else if (!loaded) return <h1 className="med-text">Loading panel...</h1>;

	return (
		<>
			<h1 className="admin-title">Admin</h1>
			<div className="admin-main">
				<Counter
					label="Server count"
					end={stats?.server_count}
					fallback="Unable to fetch servers"
					time={2}
				/>
				<Counter
					label="Upvotes"
					end={stats?.points}
					fallback="Unable to fetch stats"
					time={2}
				/>
			</div>
		</>
	);
};

export default Admin;
