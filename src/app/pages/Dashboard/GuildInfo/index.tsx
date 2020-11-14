import axios from 'axios';
import { stringify } from 'querystring';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Guild } from '../../../utils';
import './GuildInfo.scss';

interface Props {
	guild: Guild;
	accessToken: string;
}

const GuildInfo: React.FC<Props> = ({ guild, accessToken }) => {
	const history = useHistory();

	const { name, botAvailable } = guild;
	const handleClick = (
		e: React.MouseEvent<HTMLInputElement, MouseEvent>,
		redirect: boolean
	) => {
		e.preventDefault();
		// Go to dashboard
		if (redirect) {
			history.push(`/dashboard/${guild.id}`);
			return;
		}

		// Open invite window
		const width = 450;
		const left = window.innerWidth / 2 - width / 2;

		const { protocol, hostname } = window.location;
		const win = window.open(
			`/oauth/invite?${stringify({
				response_type: 'code',
				redirect_uri: `${protocol}//${hostname}/close`,
				guild_id: guild.id,
			})}`,
			'Invite Josuke',
			`scrollbar=yes,width=${width},height=${window.innerHeight},top=5,left=${left}`
		);

		// Wait until window closes
		const timer = setInterval(async () => {
			if (!win?.closed) return;
			clearInterval(timer);

			// Fetch new bot guilds
			const { data: newGuilds } = await axios.get(`/api/guilds/${accessToken}`);

			// Check if bot was added
			if (newGuilds.some((g: Guild) => g.id === guild.id && g.botAvailable)) {
				history.push(`/dashboard/${guild.id}`);
			}
		}, 500);
	};

	return (
		<div className="guild-info">
			<h2>{name}</h2>
			<input
				className={botAvailable ? 'dashboard-button' : 'setup-button'}
				type="button"
				value={botAvailable ? 'Go to Dashboard' : 'Invite to Server'}
				onClick={e => handleClick(e, botAvailable)}
			/>
		</div>
	);
};

export default GuildInfo;
