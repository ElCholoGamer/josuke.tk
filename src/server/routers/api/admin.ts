import axios from 'axios';
import crypto from 'crypto';
import express from 'express';
import adminAuth from '../../middleware/admin-auth';
import { BOT_TOKEN, CLIENT_ID, DBL_TOKEN } from '../../util/enviroment';
import { asyncHandler, DISCORD_API, notify } from '../../util/utils';

const router = express.Router();
router.use(adminAuth);

router.post(
	'/subscribe',
	asyncHandler(async (req, res) => {
		const subscription = req.body;

		// Create ID hash
		const md5sum = crypto.createHash('md5');
		md5sum.update(Buffer.from(JSON.stringify(subscription)));
		const id = md5sum.digest('hex');

		// Insert ID into subscriptions
		// await asyncExecute(
		// 	'INSERT INTO push_subscriptions (id,subscription) VALUES (?,?)',
		// 	[id, JSON.stringify(subscription)]
		// );

		// Send response
		res.status(201).json({
			status: 201,
			subscription_id: id,
		});
	})
);

router.post(
	'/unsubscribe',
	asyncHandler(async (req, res) => {
		// Check if subscription ID was provided
		const { subscription_id } = req.query;
		if (!subscription_id)
			return res.status(400).json({
				status: 400,
				message: 'Missing "subscription_id" query parameter',
			});

		const results: any = {}; /*(await asyncExecute(
			'DELETE FROM push_subscriptions WHERE id=?',
			[subscription_id]
		)) as any;*/

		if (!results.affectedRows)
			return res.status(404).json({
				status: 404,
				message: 'Non-existent subscription ID',
			});

		res.status(204).json({
			status: 204,
			message: `Subscription "${subscription_id}" successfully deleted`,
		});
	})
);

router.post(
	'/notify',
	asyncHandler(async (req, res) => {
		const { title, options = {} } = req.body;
		if (!title)
			return res.status(400).json({
				status: 400,
				message: 'Missing "title" value in request body',
			});

		await notify(title, options);
		res.status(200).json({
			status: 200,
			message: 'Notification sent',
		});
	})
);

router.get(
	'/guilds',
	asyncHandler(async (req, res) => {
		const { data } = await axios.get(`${DISCORD_API}/users/@me/guilds`, {
			headers: { Authorization: `Bot ${BOT_TOKEN}` },
		});

		res.status(200).json(data);
	})
);

router.get(
	'/stats',
	asyncHandler(async (req, res) => {
		const { data } = await axios.get(`https://top.gg/api/bots/${CLIENT_ID}`, {
			headers: { Authorization: DBL_TOKEN },
		});

		res.status(200).json(data);
	})
);

export default router;
