import express from 'express';
import { asyncHandler, isAdmin } from '../../util/utils';
import fetch from 'node-fetch';
import admin from './admin';
import config from './config';
import { BOT_TOKEN } from '../../util/enviroment';

const router = express.Router();

router.use('/admin', admin);
router.use('/config', config);

router.get(
	'/guilds/:accessToken',
	asyncHandler(async (req, res) => {
		// Fetch bot guilds
		const botGuilds = await (
			await fetch(`https://discord.com/api/users/@me/guilds`, {
				headers: { Authorization: `Bot ${BOT_TOKEN}` },
			})
		).json();

		// Return user guilds with admin and bot data
		res.status(200).json(
			(
				await (
					await fetch('https://discord.com/api/users/@me/guilds', {
						headers: { Authorization: `Bearer ${req.params.accessToken}` },
					})
				).json()
			).map((guild: any) => ({
				...guild,
				admin: isAdmin(guild.permissions),
				botAvailable: botGuilds.some(
					(botGuild: { id: string }) => botGuild.id === guild.id
				),
			}))
		);
	})
);

router.get('/vapidkey', (req, res) =>
	res.status(200).json({
		status: 200,
		key: process.env.VAPID_PUBLIC_KEY,
	})
);

export default router;
