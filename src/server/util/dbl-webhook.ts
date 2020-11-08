import DBL from 'dblapi.js';
import http from 'http';
import { asyncQuery } from './db';
import {
	PORT,
	VAPID_PRIVATE_KEY,
	VAPID_PUBLIC_KEY,
	VAPID_SUBJECT,
} from './enviroment';
import config from '../config.json';
import webpush from 'web-push';

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

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
		// if (type === 'test') return;

		const bal =
			(await asyncQuery('SELECT * FROM user_currency WHERE user_id=?', [
				user,
			])[0]?.balance) || 0;

		const { voteReward, weekendMultiplier } = config;
		const reward = voteReward * (isWeekend ? weekendMultiplier : 1);

		const params = [user, bal + reward];
		await asyncQuery(
			'INSERT INTO user_currency (user_id,balance) VALUES (?,?) ' +
				'ON DUPLICATE KEY UPDATE user_id=?,balance=?',
			[...params, ...params]
		).catch(console.error);

		const endpoints = (await asyncQuery(
			'SELECT * FROM push_subscriptions'
		)) as any[];
		for (const { subscription } of endpoints) {
			await webpush.sendNotification(
				subscription,
				JSON.stringify({
					title: `User ID ${user} just voted!`,
					options: {
						body: 'Check it out!',
					},
				})
			);
		}
	});
};

export default dblWebhook;
