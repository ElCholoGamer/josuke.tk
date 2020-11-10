/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
import express from 'express';
import { asyncExecute } from '../util/db';
import { DBL_TOKEN } from '../util/enviroment';
import { asyncHandler, DISCORD_API, notify } from '../util/utils';
import config from '../config.json';
import axios from 'axios';

const router = express.Router();

router.post(
	'/',
	asyncHandler(async (req, res) => {
		const { authorization } = req.headers;
		if (authorization !== DBL_TOKEN)
			return res.status(403).json({
				status: 403,
				message: 'Invalid "Authorization" header in request',
			});

		const { user, isWeekend = false, type = 'test' } = req.body;
		if (!user)
			return res.status(400).json({
				status: 400,
				message: 'Missing "user" value in request body',
			});

		console.log('Vote type:', type);
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

		const response = await axios
			.get(`${DISCORD_API}/users/${user}`)
			.catch(() => ({ status: 403, data: {} }));

		const title =
			response.status !== 200
				? `User ID ${user} just voted!`
				: (() => {
						const { username, discriminator } = response.data;
						return `${username}#${discriminator}`;
				  })();

		await notify(title);

		res.status(200).json({
			status: 200,
			message: 'Vote received',
		});
	})
);

export default router;