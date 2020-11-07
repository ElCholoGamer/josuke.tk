import DBL from 'dblapi.js';
import http from 'http';
import { asyncQuery } from './db';
import { PORT } from './enviroment';
import config from '../../config.json';

const dblWebhook = (token: string | undefined, server: http.Server) => {
	if (!token) return;
	console.log('Connecting to DBL webhook...');

	const dbl = new DBL(token, {
		webhookServer: server,
		webhookAuth: token,
		webhookPort: PORT,
	});

	dbl.on('posted', () => console.log("This should't log lol"));
	dbl.on('error', err => console.error('An error occurred with DBL!', err));

	const { webhook } = dbl;
	webhook.on('ready', ({ port, path, hostname }) =>
		console.log(`DBL webhook listening at ${hostname}:${port}${path}...`)
	);

	webhook.on('vote', async ({ user, isWeekend, type }) => {
		console.log(`User ID ${user} just voted!`);
		if (type === 'test') return;

		const bal =
			(await asyncQuery('SELECT * FROM user_currency WHERE user_id=?', [
				user,
			])[0]?.balance) || 0;

		const { voteReward, weekendMultiplier } = config;
		const reward = voteReward * (isWeekend ? weekendMultiplier : 1);

		const params = [user, bal + reward];
		asyncQuery(
			'INSERT INTO user_currency (user_id,balance) VALUES (?,?) ' +
				'ON DUPLICATE KEY UPDATE user_id=?,balance=?',
			[...params, ...params]
		).catch(console.error);
	});
};

export default dblWebhook;
