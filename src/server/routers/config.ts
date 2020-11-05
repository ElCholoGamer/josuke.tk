import express from 'express';
import mysql from 'mysql';
import { isAdmin, asyncHandler, db } from '../utils';

const router = express.Router();

// Get the settings for a guild ID
router.get(
	'/config/:guildId',
	asyncHandler(async (req, res) => {
		const { guildId } = req.params;
		if (!(await checkAdmin(req.query.authorization?.toString(), guildId))) {
			return res.status(200).json({ status: 'NOT ALLOWED' });
		}

		// Fetch guild name
		const { name } = await (
			await fetch(`https://discordapp.com/api/guilds/${guildId}`, {
				headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` },
			})
		).json();
		if (!name) return res.status(200).json({ status: 'GUILD NOT FOUND' });

		db.query(
			'SELECT * FROM configs WHERE guild_id=?',
			[guildId],
			(err, results) => {
				if (err) throw new Error(err.sqlMessage);

				if (!results.length) {
					res.status(200).json({
						guildName: name,
						prefix: 'jo! ',
						snipe: true,
						levels: true,
						send_level: true,
						level_message:
							'Congratulations, {user}, you have reached level {lvl}!',
					});
				} else {
					const [
						{ prefix, snipe, levels, send_level, level_message },
					] = results;

					res.status(200).json({
						guildName: name,
						prefix,
						snipe: snipe === 1,
						levels: levels === 1,
						send_level: send_level === 1,
						level_message,
					});
				}
			}
		);
	})
);

// Update the settings for a guild ID
router.put(
	'/config/:guildId',
	asyncHandler(async (req, res) => {
		const { guildId } = req.params;

		// Check if uses is allowed
		if (!(await checkAdmin(req.query.authorization?.toString(), guildId))) {
			return res.status(200).json({ status: 'NOT ALLOWED' });
		}

		// Upsert data into table
		const { prefix, snipe, levels, level_message, send_level } = req.body;
		const params = [
			guildId,
			prefix || 'jo! ',
			snipe ? 1 : 0,
			levels ? 1 : 0,
			send_level ? 1 : 0,
			level_message,
		];
		db.query(
			'INSERT INTO configs (guild_id,prefix,snipe,levels,send_level,level_message) VALUES (?,?,?,?,?,?) ' +
				'ON DUPLICATE KEY UPDATE guild_id=?, prefix=?, snipe=?, levels=?,send_level=?,level_message=?',
			[...params, ...params],
			err => {
				if (err) {
					console.error(err);
					res.status(500).json({ status: 'MYSQL ERROR', error: err });
				} else {
					res.status(200).json({ status: 'OK' });
				}
			}
		);
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
