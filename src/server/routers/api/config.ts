import express from 'express';
import { asyncExecute } from '../../util/db';
import { asyncHandler } from '../../util/utils';
import configAuth from '../../middleware/config-auth';

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
		const config = (
			await asyncExecute('SELECT * FROM configs WHERE guild_id=?', [guild_id])
		)[0] || {
			prefix: 'jo! ',
			snipe: true,
			levels: true,
			send_level: true,
			level_message: 'Congratulations, {user}, you have reached level {lvl}!',
		};

		// Send response
		const { prefix, snipe, levels, send_level, level_message } = config;
		res.status(200).json({
			guildName,
			prefix,
			snipe: !!snipe,
			levels: !!levels,
			send_level: !!send_level,
			level_message,
		});
	})
);

// Update the settings for a guild ID
router.put(
	'/',
	asyncHandler(async (req, res) => {
		const {
			query: { guild_id },
		} = req;

		// Get data with defaults
		const {
			prefix = 'jo! ',
			snipe = true,
			levels = true,
			level_message,
			send_level = true,
		} = req.body;

		// Create query params
		const params = [
			guild_id,
			prefix,
			+snipe,
			+levels,
			+send_level,
			level_message,
		];

		// Upsert data and send response
		await asyncExecute(
			'INSERT INTO configs (guild_id,prefix,snipe,levels,send_level,level_message) VALUES (?,?,?,?,?,?) ' +
				'ON DUPLICATE KEY UPDATE guild_id=?, prefix=?, snipe=?, levels=?,send_level=?,level_message=?',
			[...params, ...params]
		);
		res.status(200).json({ status: 200, new_config: params });
	})
);

export default router;
