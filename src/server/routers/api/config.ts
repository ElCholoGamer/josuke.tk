import express from 'express';
import configAuth from '../../middleware/config-auth';
import { asyncHandler } from '../../util/utils';
import Guild, { defaultConfig } from '../../models/guild';
import validator from '../../middleware/validator';

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
	validator({
		prefix: { required: false, type: 'string', minLength: 1 },
		snipe: { required: false, type: 'boolean' },
		levels: { required: false, type: 'boolean' },
		sendLevel: { required: false, type: 'boolean' },
		levelMessage: { required: false, type: 'string', minLength: 1 },
		lang: { required: false, type: 'string', minLength: 5, maxLength: 5 },
	}),
	asyncHandler(async (req, res) => {
		const {
			query: { guild_id },
			body,
		} = req;

		const guild =
			(await Guild.findById(guild_id)) || new Guild({ _id: guild_id });

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
