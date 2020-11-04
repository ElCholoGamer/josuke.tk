import express from 'express';
import fetch from 'node-fetch';
import { convertPerms } from 'jsdiscordperms';

const router = express.Router();

router.get('/guilds/:accessToken', async (req, res) => {
	try {
		// Fetch bot guilds
		const botGuilds = await (
			await fetch(`https://discordapp.com/api/users/@me/guilds`, {
				headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` },
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

export default router;
