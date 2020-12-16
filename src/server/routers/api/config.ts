import express from 'express';
import configAuth from '../../middleware/config-auth';
import { asyncHandler } from '../../util/utils';
import Guild, { defaultConfig } from '../../models/guild';

const router = express.Router();

router.use(configAuth);

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
			(await Guild.findOne({ _id: guild_id }))?.config || defaultConfig;

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

		// Upsert data and send response
		const guild =
			(await Guild.findById(guild_id)) ||
			new Guild({
				config: defaultConfig,
				members: {},
			});

		// Create new config
		const newConfig = {
			...defaultConfig,
			...body,
		};

		guild.config = newConfig;
		await guild.save();

		res.json({ status: 200, config: newConfig });
	})
);

export default router;
