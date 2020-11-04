import express from 'express';
import fetch from 'node-fetch';
import { convertPerms } from 'jsdiscordperms';
import mysql from 'mysql';

const { BOT_TOKEN, DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
const router = express.Router();

// Get the settings for a guild ID
router.get('/config/:guildId', async (req, res) => {
	const { guildId } = req.params;
	if (!(await checkAdmin(req.query.authorization?.toString(), guildId))) {
		return res.status(200).json({ status: 'NOT ALLOWED' });
	}

	// Fetch guild name
	const { name } = await (
		await fetch(`https://discordapp.com/api/guilds/${guildId}`, {
			headers: { Authorization: `Bot ${BOT_TOKEN}` },
		})
	).json();
	if (!name) {
		return res.status(200).json({ status: 'GUILD NOT FOUND' });
	}

	const connection = getConnection();
	connection.connect(err => {
		if (err) {
			console.error(err);
			return res.status(500).json({ status: 'ERROR', error: err });
		}

		connection.query(
			'SELECT * FROM configs WHERE guild_id=?',
			[guildId],
			(err, results) => {
				connection.end();
				if (err) {
					console.error(err);
					return res.status(500).json({ status: 'ERROR', error: err });
				}

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
	});
});

// Update the settings for a guild ID
router.put('/config/:guildId', async (req, res) => {
	const { guildId } = req.params;
	try {
		// Check if uses is allowed
		if (!(await checkAdmin(req.query.authorization?.toString(), guildId))) {
			return res.status(200).json({ status: 'NOT ALLOWED' });
		}

		const connection = getConnection();
		connection.connect(err => {
			if (err) {
				console.error(err);
				return res.status(500).json({ status: 'MYSQL ERROR', error: err });
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
			connection.query(
				'INSERT INTO configs (guild_id,prefix,snipe,levels,send_level,level_message) VALUES (?,?,?,?,?,?) ' +
					'ON DUPLICATE KEY UPDATE guild_id=?, prefix=?, snipe=?, levels=?,send_level=?,level_message=?',
				[...params, ...params],
				err => {
					connection.end();
					if (err) {
						console.error(err);
						res.status(500).json({ status: 'MYSQL ERROR', error: err });
					} else {
						res.status(200).json({ status: 'OK' });
					}
				}
			);
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: 'ERROR' });
	}
});

router.get('/guilds/:accessToken', async (req, res) => {
	try {
		// Fetch bot guilds
		const botGuilds = await (
			await fetch(`https://discordapp.com/api/users/@me/guilds`, {
				headers: { Authorization: `Bot ${BOT_TOKEN}` },
			})
		).json();

		// Return user guilds with admin and bot data
		res.status(200).json(
			(
				await (
					await fetch('https://discordapp.com/api/users/@me/guilds', {
						headers: { Authorization: `Bearer ${req.params.accessToken}` },
					})
				).json()
			).map((guild: any) => ({
				...guild,
				admin: convertPerms(guild.permissions).ADMINISTRATOR,
				botAvailable: botGuilds.some(
					(botGuild: any) => botGuild.id === guild.id
				),
			}))
		);
	} catch (err) {
		res.status(500).json({ error: err });
	}
});

const getConnection = () =>
	mysql.createConnection({
		host: DB_HOST,
		port: 3306,
		user: DB_USER,
		password: DB_PASSWORD,
		database: DB_NAME,
		supportBigNumbers: true,
	});

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
		(guild: any) =>
			guild.id === guildId && convertPerms(guild.permissions).ADMINISTRATOR
	);
};

export default router;
