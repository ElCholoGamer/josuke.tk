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
		const guildName = await checkAdmin(
			req.query.authorization?.toString(),
			guildId
		);

		if (!guildName)
			return res.status(401).json({
				status: 401,
				message: 'User is not an administrator or guild does not exist.',
			});

		const results = (await asyncQuery(
			'SELECT * FROM configs WHERE guild_id=?',
			[guildId]
		)) || [
			{
				prefix: 'jo! ',
				snipe: true,
				levels: true,
				send_level: true,
				level_message: 'Congratulations, {user}, you have reached level {lvl}!',
			},
		];

		const [{ prefix, snipe, levels, send_level, level_message }] = results;

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
	'/:guildId',
	asyncHandler(async (req, res) => {
		const { guildId } = req.params;

		// Check if uses is allowed
		if (!(await checkAdmin(req.query.authorization?.toString(), guildId)))
			return res
				.status(401)
				.json({ status: 401, message: 'User is not an administrator' });

		// Upsert data into table
		const { prefix, snipe, levels, level_message, send_level } = req.body;
		const params = [
			guildId,
			prefix,
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

/**
 * A function that checks if the given authorization header
 * is authrorized for retrieving the given guild ID's data,
 * and returns the guild's name if so.
 * @param authorization The authorization request header.
 * @param guildId The guild's ID
 */
const checkAdmin = async (
	authorization: string | undefined,
	guildId: string
): Promise<string | null> => {
	if (!authorization) return null;

	// Get user guilds
	const guilds: any[] = await (
		await fetch('https://discordapp.com/api/users/@me/guilds', {
			headers: { Authorization: authorization },
		})
	).json();

	// Check if user has access to guild and is administrator
	const guild = guilds.find((guild: { id: string }) => guild.id === guildId);
	if (!guild || !isAdmin(guild.permissions)) return null;
	return guild.name;
};

export default router;
