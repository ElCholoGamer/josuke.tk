/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
import axios from 'axios';
import express from 'express';
import config from '../config.json';
import db from '../util/db';
import { DBL_TOKEN } from '../util/enviroment';
import { asyncHandler, DISCORD_API, notify } from '../util/utils';

const router = express.Router();

const Users = db.collection('users');

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

		console.log(`User ID ${user} just voted!`);

		if (type !== 'test') {
			// Add vote reward to user
			const data = (await Users.findOne({ _id: user })) || {
				balance: 0,
				lastDaily: 0,
				items: [],
				multipliers: [],
			};

			const { voteReward, weekendMultiplier } = config;
			const reward = voteReward * (isWeekend ? weekendMultiplier : 1);

			data.balance += reward;
			await Users.findOneAndReplace({ _id: user }, data, { upsert: true });
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
