/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
import express from 'express';
import adminAuth from '../../middleware/admin-auth';
import { asyncHandler } from '../../util/utils';
import { asyncExecute } from '../../util/db';
import crypto from 'crypto';
import {
	BOT_TOKEN,
	CLIENT_ID,
	VAPID_PRIVATE_KEY,
	VAPID_PUBLIC_KEY,
	VAPID_SUBJECT,
} from '../../util/enviroment';
import webpush from 'web-push';
import fetch from 'node-fetch';

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

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
		await asyncExecute(
			'INSERT INTO push_subscriptions (id,subscription) VALUES (?,?)',
			[id, JSON.stringify(subscription)]
		);

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

		const results = (await asyncExecute(
			'DELETE FROM push_subscriptions WHERE id=?',
			[subscription_id]
		)) as any;

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
		const subscriptions = await asyncExecute(
			'SELECT * FROM push_subscriptions'
		);

		const response = await fetch('https://discordapp.com/api/users/@me', {
			headers: { Authorization: `Bot ${BOT_TOKEN}` },
		});

		// Get bot avatar URL
		const icon =
			response.status !== 200
				? ''
				: await (async () => {
						const { avatar, discriminator } = await response.json();
						return `https://cdn.discordapp.com/${
							avatar
								? `avatars/${CLIENT_ID}/${avatar}`
								: `embed/avatars/${discriminator % 5}`
						}.png`;
				  })();

		const { title, options = {} } = req.body;
		const notification = {
			title,
			options: {
				icon,
				...options,
			},
		};

		await Promise.all(
			subscriptions.map(async row =>
				webpush.sendNotification(row.subscription, JSON.stringify(notification))
			)
		);

		res.status(200).json({
			status: 200,
			notification,
		});
	})
);

export default router;
