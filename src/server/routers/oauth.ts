import express from 'express';
import fetch from 'node-fetch';
import { asyncHandler, stringify } from '../util/utils';
import { CLIENT_ID, CLIENT_SECRET } from '../util/enviroment';

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
	res.status(200).redirect(
		`https://discord.com/api/oauth2/authorize?${stringify({
			...OauthQuery,
			redirect_uri: `${protocol}://${hostname}${baseUrl}/callback`,
		})}`
	);
});

// Login callback
router.get(
	'/callback',
	asyncHandler(async (req, res) => {
		const { code, error } = req.query;

		if (error) return res.status(200).redirect('/');

		if (!code)
			return res
				.status(400)
				.json({ error: 'No code querystring was provided' });

		const { protocol, hostname, baseUrl, path } = req;
		const redirect_uri = `${protocol}://${hostname}${baseUrl}${path}`;

		const response = await (
			await fetch('https://discord.com/api/oauth2/token', {
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

		res.status(200).redirect(
			`/?${stringify({
				access_token,
				refresh_token,
				expires_in,
			})}`
		);
	})
);

// Get refreshed token
router.get(
	'/refresh/:token',
	asyncHandler(async (req, res) => {
		const { params, protocol, hostname, path } = req;

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
						redirect_uri: `${protocol}://${hostname}${path}`,
						grant_type: 'refresh_token',
						refresh_token: params.token,
						scope: OAuthScope,
					}),
				}
			)
		).json();

		res.status(200).json(json);
	})
);

// Revoke an access token
router.post(
	'/revoke/:token',
	asyncHandler(async (req, res) => {
		const response = await (
			await fetch('https://discord.com/api/oauth2/token/revoke', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: stringify({
					client_id: CLIENT_ID,
					client_secret: CLIENT_SECRET,
					token: req.params.token,
				}),
			})
		).json();

		res.status(200).json(response);
	})
);

// Invite bot
router.get('/invite', (req, res) => {
	res.status(200).redirect(
		`https://discord.com/api/oauth2/authorize?${stringify({
			client_id: CLIENT_ID,
			permissions: 280095814,
			scope: 'bot',
			...req.query,
		})}`
	);
});

export default router;
