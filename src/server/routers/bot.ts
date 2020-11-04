import express from 'express';
import { stringify } from 'querystring';

const router = express.Router();

router.get('/invite', (req, res) => {
	res.redirect(
		`https://discord.com/api/oauth2/authorize?${stringify({
			client_id: process.env.CLIENT_ID,
			permissions: 280095814,
			scope: 'bot',
			...req.query,
		})}`
	);
});

export default router;
