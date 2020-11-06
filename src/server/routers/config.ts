import express from 'express';
import { isAdmin, asyncHandler } from '../util/utils';
import { asyncQuery } from '../util/db';
import fetch from 'node-fetch';

const router = express.Router();

// Get the settings for a guild ID
router.get(
	'/:guildId',
	asyncHandler(async (req, res) => {
		const { guildId } = req.params;
		if (!(await checkAdmin(req.query.authorization?.toString(), guildId))) {
			return res
				.status(401)
				.json({ status: 401, message: 'User is not an administrator' });
		}

		// Fetch guild name
		const { name } = await (
			await fetch(`https://discordapp.com/api/guilds/${guildId}`, {
				headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` },
			})
		).json();

		if (!name)
			return res
				.status(404)
				.json({ status: `Guild by ID "${guildId}" not found` });

		const [
			results,
		] = (await asyncQuery('SELECT * FROM configs WHERE guild_id=?', [
			guildId,
		])) || [
			{
				guildName: name,
				prefix: 'jo! ',
				snipe: true,
				levels: true,
				send_level: true,
				level_message: 'Congratulations, {user}, you have reached level {lvl}!',
			},
		];

		const [{ prefix, snipe, levels, send_level, level_message }] = results;

		res.status(200).json({
			guildName: name,
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
	'/:guildId',
	asyncHandler(async (req, res, next) => {
		const { guildId } = req.params;

		// Check if uses is allowed
		if (!(await checkAdmin(req.query.authorization?.toString(), guildId)))
			return res.status(200).json({ status: 'NOT ALLOWED' });

		// Upsert data into table
		const { prefix, snipe, levels, level_message, send_level } = req.body;
		const params = [
			guildId,
			prefix || 'jo! ',
			+snipe,
			+levels,
			+send_level,
			level_message,
		];

		await asyncQuery(
			'INSERT INTO configs (guild_id,prefix,snipe,levels,send_level,level_message) VALUES (?,?,?,?,?,?) ' +
				'ON DUPLICATE KEY UPDATE guild_id=?, prefix=?, snipe=?, levels=?,send_level=?,level_message=?',
			[...params, ...params]
		);

		res.status(200).json({ status: 200, message: 'OK' });
	})
);

const checkAdmin = async (
	authorization: string | undefined,
	guildId: string
): Promise<boolean> => {
	if (!authorization) return false;

	// Get user guilds
	const guilds = await (
		await fetch('https://discordapp.com/api/users/@me/guilds', {
			headers: { Authorization: authorization },
		})
	).json();

	// Check if user has access to guild and is administrator
	return guilds.some(
		(guild: any) => guild.id === guildId && isAdmin(guild.permissions)
	);
};

export default router;
