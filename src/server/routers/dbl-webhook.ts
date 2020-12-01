import express from 'express';
import config from '../config.json';
import db from '../util/db';
import { DBL_TOKEN } from '../util/enviroment';
import { asyncHandler } from '../util/utils';

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

		res.json({
			status: 200,
			message: 'Vote received',
		});
	})
);

export default router;
