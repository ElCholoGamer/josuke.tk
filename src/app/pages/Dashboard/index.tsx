import axios from 'axios';
import React from 'react';
import { debug, Guild, User } from '../../utils';
import './Dashboard.scss';
import GuildInfo from './GuildInfo';

interface Props {
	user: User | null;
}

const Dashboard: React.FC<Props> = ({ user }) => {
	const [guilds, setGuilds] = React.useState<Guild[] | null>(null);

	// Fetch user guilds
	React.useEffect(() => {
		if (!user) return;

		let mounted = true;
		(async () => {
			try {
				// Get bot guilds and use them to filter stuff
				const { data } = await axios.get(`/api/guilds/${user.accessToken}`);
				if (mounted) setGuilds(data);
			} catch (err) {
				debug(err);
			}
		})();

		return () => {
			mounted = false;
		};
	}, [user]);

	document.title = 'Dashboard';

	if (!user)
		return <h1 className="med-text">Log in to access your servers!</h1>;
	else if (!guilds?.filter)
		return <h1 className="med-text">Loading servers...</h1>;

	const adminGuilds = guilds
		.filter(guild => guild.admin)
		.sort(({ name: a }, { name: b }) => (a < b ? -1 : a > b ? 1 : 0));

	return (
		<main className="dashboard">
			<h1>Dashboard</h1>
			{!adminGuilds.length ? (
				<h3>You are not an administrator in any server yet!</h3>
			) : (
				adminGuilds.map(guild => (
					<GuildInfo
						key={guild.id}
						guild={guild}
						accessToken={user.accessToken}
					/>
				))
			)}
		</main>
	);
};

export default Dashboard;
