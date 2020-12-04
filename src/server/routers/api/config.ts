import express from 'express';
import configAuth from '../../middleware/config-auth';
import db from '../../util/db';
import { asyncHandler } from '../../util/utils';

const router = express.Router();

router.use(configAuth);

const Guilds = db.collection('guilds', {});
const defaultConfig = {
	prefix: 'jo! ',
	snipe: true,
	levels: true,
	sendLevel: true,
	levelMessage: 'Congratulations, {user}, you have reached level {lvl}!',
};

// Get the settings for a guild ID
router.get(
	'/',
	asyncHandler(async (req, res) => {
		const {
			query: { guild_id },
			headers: { guildName },
		} = req;

		// Check guild name exists
		if (!guildName)
			return res.status(403).json({
				status: 403,
				message: 'User is not an administrator or guild does not exist.',
			});

		// Get config from database
		const config =
			(await Guilds.findOne({ _id: guild_id }))?.config || defaultConfig;

		// Send response
		res.json({
			...config,
			guildName,
		});
	})
);

// Update the settings for a guild ID
router.put(
	'/',
	asyncHandler(async (req, res) => {
		const {
			query: { guild_id },
			body,
		} = req;

		// Get data with defaults
		const newConfig = {
			...defaultConfig,
			...body,
		};

		// Upsert data and send response
		const guildData = (await Guilds.findOne({ _id: guild_id })) || {
			_id: guild_id,
			config: defaultConfig,
			members: {},
		};

		guildData.config = newConfig;

		await Guilds.findOneAndReplace({ _id: guild_id }, guildData, {
			upsert: true,
		});

		res.json({ status: 200, config: newConfig });
	})
);

export default router;
