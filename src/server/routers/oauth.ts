import express from 'express';
import fetch from 'node-fetch';
import { stringify } from 'querystring';

const { CLIENT_ID, CLIENT_SECRET } = process.env;

const router = express.Router();

const OAuthScope = ['guilds', 'identify'].join(' ');
const OauthQuery = {
	scope: OAuthScope,
	response_type: 'code',
	client_id: CLIENT_ID,
};

// Login redirect
router.get('/login', (req, res) => {
	const { protocol, hostname, baseUrl } = req;
	res.redirect(
		`https://discord.com/api/oauth2/authorize?${stringify({
			...OauthQuery,
			redirect_uri: `${protocol}://${hostname}${baseUrl}/callback`,
		})}`
	);
});

// Login callback
router.get('/callback', async (req, res) => {
	const { code, error } = req.query;

	if (error) return res.status(200).redirect('/');

	if (!code)
		return res.status(400).json({ error: 'No code querystring was provided' });

	try {
		const { protocol, hostname, baseUrl, path } = req;
		const redirect_uri = `${protocol}://${hostname}${baseUrl}${path}`;

		const response = await (
			await fetch('https://discordapp.com/api/oauth2/token', {
				method: 'POST',
				body: stringify({
					redirect_uri,
					client_id: CLIENT_ID,
					client_secret: CLIENT_SECRET,
					code: code.toString(),
					grant_type: 'authorization_code',
				}),
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			})
		).json();

		const { scope, access_token, refresh_token, expires_in } = response;
		if (scope !== OAuthScope) {
			return res.status(400).json({
				error: `Expected scope "${OAuthScope}", got instead "${scope}"`,
			});
		}

		res.redirect(
			`/?${stringify({
				access_token,
				refresh_token,
				expires_in,
			})}`
		);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err });
	}
});

// Get refreshed token
router.get('/refresh/:token', async (req, res) => {
	const { token } = req.params;

	const json = await (
		await fetch(
			`https://discord.com/api/oauth2/token?grant_type=refresh_token`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: stringify({
					client_id: CLIENT_ID,
					client_secret: CLIENT_SECRET,
					redirect_uri: `${req.protocol}://${req.hostname}${req.path}`,
					grant_type: 'refresh_token',
					refresh_token: token,
					scope: OAuthScope,
				}),
			}
		)
	).json();

	res.json(json);
});

// Revoke an access token
router.post('/revoke/:token', async (req, res) => {
	try {
		const { token } = req.params;
		res.status(200).json(
			await (
				await fetch('https://discordapp.com/api/oauth2/token/revoke', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					body: stringify({
						client_id: CLIENT_ID,
						client_secret: CLIENT_SECRET,
						token,
					}),
				})
			).json()
		);
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: 'ERROR' });
	}
});

export default router;
