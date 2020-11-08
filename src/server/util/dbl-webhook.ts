/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
import DBL from 'dblapi.js';
import http from 'http';
import { asyncExecute } from './db';
import { ADMIN_PASSWORD, PORT } from './enviroment';
import config from '../config.json';
import fetch from 'node-fetch';

const dblWebhook = (token: string | undefined, server: http.Server) => {
	console.log('Connecting to DBL webhook...');
	if (!token) {
		console.log('No DBL token available');
		return;
	}

	const dbl = new DBL(token, {
		webhookServer: server,
		webhookAuth: token,
		webhookPort: PORT,
	});

	dbl.on('error', err => console.error('An error occurred with DBL!', err));

	const { webhook } = dbl;
	webhook.on('ready', ({ port, path, hostname }) =>
		console.log(`DBL webhook listening at ${hostname}:${port}${path}...`)
	);

	webhook.on('vote', async ({ user, isWeekend, type }) => {
		console.log(`User ID ${user} just voted!`);

		if (type !== 'test') {
			// Add vote reward to user
			const bal =
				(await asyncExecute('SELECT * FROM user_currency WHERE user_id=?', [
					user,
				])[0]?.balance) || 0;

			const { voteReward, weekendMultiplier } = config;
			const reward = voteReward * (isWeekend ? weekendMultiplier : 1);

			const params = [user, bal + reward];
			await asyncExecute(
				'INSERT INTO user_currency (user_id,balance) VALUES (?,?) ' +
					'ON DUPLICATE KEY UPDATE user_id=?,balance=?',
				[...params, ...params]
			).catch(console.error);
		}

		const res = await fetch(`https://discordapp.com/api/users/${user}`);
		const title =
			res.status !== 200
				? `User ID ${user} just voted!`
				: await (async () => {
						const { username, discriminator } = await res.json();
						return `${username}#${discriminator}`;
				  })();

		fetch('/api/admin/notify', {
			method: 'POST',
			headers: { Authorization: ADMIN_PASSWORD },
			body: JSON.stringify({
				title,
			}),
		});
	});
};

export default dblWebhook;
