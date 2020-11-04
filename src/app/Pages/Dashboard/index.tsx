import React from 'react';
import GuildInfo from './GuildInfo';
import { Guild, User } from '../../utils';
import './Dashboard.scss';

interface Props {
	user: User | null;
}

const Dashboard: React.FC<Props> = ({ user }) => {
	const [guilds, setGuilds] = React.useState<Guild[] | null>(null);
	const mounted = React.useRef(true);

	// Fetch user guilds
	React.useEffect(() => {
		if (!user || !mounted) return;
		(async () => {
			try {
				// Get bot guilds and use them to filter stuff
				const res = await (
					await fetch(`/api/guilds/${user.accessToken}`)
				).json();

				if (mounted.current) setGuilds(res);
			} catch (err) {
				console.error(err);
			}
		})();

		return () => {
			mounted.current = false;
		};
	}, [user, mounted]);

	document.title = 'Dashboard';

	if (!user)
		return <h1 className="med-text">Log in to access your servers!</h1>;

	if (!guilds?.filter) return <h1 className="med-text">Loading servers...</h1>;

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
