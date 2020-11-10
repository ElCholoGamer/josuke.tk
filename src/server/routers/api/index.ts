import express from 'express';
import { asyncHandler, DISCORD_API, isAdmin } from '../../util/utils';
import admin from './admin';
import config from './config';
import { BOT_TOKEN } from '../../util/enviroment';
import axios from 'axios';

const router = express.Router();

router.use('/admin', admin);
router.use('/config', config);

router.get(
	'/guilds/:accessToken',
	asyncHandler(async (req, res) => {
		// Fetch bot guilds
		const { data: botGuilds } = await axios.get(
			`${DISCORD_API}/users/@me/guilds`,
			{
				headers: { Authorization: `Bot ${BOT_TOKEN}` },
			}
		);

		// Return user guilds with admin and bot data
		const { data: userGuilds } = await axios.get(
			`${DISCORD_API}/users/@me/guilds`,
			{
				headers: { Authorization: `Bearer ${req.params.accessToken}` },
			}
		);
		res.status(200).json(
			userGuilds.map((guild: any) => ({
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
