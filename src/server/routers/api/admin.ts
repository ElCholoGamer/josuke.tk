import axios from 'axios';
import express from 'express';
import adminAuth from '../../middleware/admin-auth';
import { BOT_TOKEN, CLIENT_ID, DBL_TOKEN } from '../../util/enviroment';
import { asyncHandler, DISCORD_API } from '../../util/utils';

const router = express.Router();
router.use(adminAuth);

router.get(
	'/guilds',
	asyncHandler(async (req, res) => {
		const { data } = await axios.get(`${DISCORD_API}/users/@me/guilds`, {
			headers: { Authorization: `Bot ${BOT_TOKEN}` },
		});

		res.json(data);
	})
);

router.get(
	'/stats',
	asyncHandler(async (req, res) => {
		const { data } = await axios.get(`https://top.gg/api/bots/${CLIENT_ID}`, {
			headers: { Authorization: DBL_TOKEN },
		});

		res.json(data);
	})
);

export default router;
