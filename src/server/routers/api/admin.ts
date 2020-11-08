import express from 'express';
import adminAuth from '../../middleware/admin-auth';
import { asyncHandler } from '../../util/utils';
import { asyncQuery } from '../../util/db';
import crypto from 'crypto';

const router = express.Router();

router.use(adminAuth);

router.post(
	'/subscribe',
	asyncHandler(async (req, res) => {
		const subscription = req.body;

		const md5sum = crypto.createHash('md5');
		md5sum.update(Buffer.from(JSON.stringify(subscription)));
		const id = md5sum.digest('hex');

		await asyncQuery(
			'INSERT INTO push_subscriptions (id,subscription) VALUES (?,?)',
			[id, JSON.stringify(subscription)]
		);

		res.status(201).json({
			status: 201,
			subscription_id: id,
		});
	})
);

export default router;
