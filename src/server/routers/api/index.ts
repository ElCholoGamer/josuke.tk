import express from 'express';
import { asyncHandler, DISCORD_API, isAdmin } from '../../util/utils';
import admin from './admin';
import config from './config';
import { BOT_TOKEN } from '../../util/enviroment';
import axios from 'axios';
import User from '../../models/user';
import Guild from '../../models/guild';

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

		const guilds = userGuilds.map((guild: any) => ({
			...guild,
			admin: isAdmin(guild.permissions),
			botAvailable: botGuilds.some(
				(botGuild: { id: string }) => botGuild.id === guild.id
			),
		}));

		res.json(guilds);
	})
);

// Delete a user's data
router.delete(
	'/data',
	asyncHandler(async (req, res) => {
		const { token } = req.query;
		if (!token) {
			return res.status(401).json({
				status: 401,
				message: 'Missing "token" query parameter',
			});
		}

		// Get user info
		const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };
		const response = await axios.get(`${DISCORD_API}/users/@me`, axiosConfig);

		if (response.status !== 200) {
			res.status(401).json({
				status: 401,
				message: 'Invalid token provided',
			});
		}

		const { id } = response.data;
		await User.findByIdAndDelete(id);

		const { data: guilds } = await axios.get(
			`${dispatchEvent}/users/@me/guilds`,
			axiosConfig
		);

		await Promise.all(
			guilds.map(async (guild: any) => {
				const data = await Guild.findById(guild.id);
				if (!data) return;

				// Delete the member's data
				delete data.members[id];
				await data.save();
			})
		);

		res.json({
			status: 200,
			message: 'Data succesfully deleted',
		});
	})
);

export default router;
