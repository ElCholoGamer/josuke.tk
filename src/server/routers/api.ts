import express from 'express';
import { asyncHandler, isAdmin } from '../util/utils';
import fetch from 'node-fetch';

const router = express.Router();

router.get(
	'/guilds/:accessToken',
	asyncHandler(async (req, res) => {
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
				admin: isAdmin(guild.permissions),
				botAvailable: botGuilds.some(
					(botGuild: any) => botGuild.id === guild.id
				),
			}))
		);
	})
);

export default router;
