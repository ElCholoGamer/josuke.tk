import axios from 'axios';
import express from 'express';
import { CLIENT_ID, CLIENT_SECRET } from '../util/enviroment';
import { asyncHandler, DISCORD_API, stringify } from '../util/utils';

const router = express.Router();

const OAuthScope = ['guilds', 'identify'].join(' ');
const OauthQuery = {
	scope: OAuthScope,
	response_type: 'code',
	client_id: CLIENT_ID,
};

// Login redirect
router.get('/login', (req, res) => {
	const { hostname, baseUrl } = req;
	const protocol = hostname.indexOf('localhost') === -1 ? 'https' : 'http';

	res.redirect(
		`${DISCORD_API}/oauth2/authorize?${stringify({
			...OauthQuery,
			redirect_uri: encodeURIComponent(
				`${protocol}://${hostname}${baseUrl}/callback`
			),
		})}`
	);
});

// Login callback
router.get(
	'/callback',
	asyncHandler(async (req, res) => {
		const { code, error } = req.query;

		if (error) return res.redirect('/');

		if (!code) {
			return res
				.status(400)
				.json({ error: 'No code querystring was provided' });
		}

		const { protocol, hostname, baseUrl, path } = req;
		const redirect_uri = `${protocol}://${hostname}${baseUrl}${path}`;

		const { data } = await axios.post(
			`${DISCORD_API}/oauth2/token`,
			stringify({
				redirect_uri,
				client_id: CLIENT_ID,
				client_secret: CLIENT_SECRET,
				code,
				grant_type: 'authorization_code',
			}),
			{
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			}
		);

		const { scope, access_token, refresh_token, expires_in } = data;
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
	})
);

// Get refreshed token
router.get(
	'/refresh',
	asyncHandler(async (req, res) => {
		const { query, protocol, hostname, path } = req;

		const { data } = await axios.post(
			`${DISCORD_API}/oauth2/token?grant_type=refresh_token`,
			stringify({
				client_id: CLIENT_ID,
				client_secret: CLIENT_SECRET,
				redirect_uri: `${protocol}://${hostname}${path}`,
				grant_type: 'refresh_token',
				refresh_token: query.token,
				scope: OAuthScope,
			}),
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);

		res.json(data);
	})
);

// Revoke an access token
router.post(
	'/revoke',
	asyncHandler(async (req, res) => {
		const { token } = req.query;
		if (!token) {
			return res.status(400).json({
				status: 400,
				message: 'Missing "token" query parameter',
			});
		}

		const { data } = await axios.post(
			`${DISCORD_API}/oauth2/token/revoke`,
			stringify({
				client_id: CLIENT_ID,
				client_secret: CLIENT_SECRET,
				token,
			})
		);

		res.json(data);
	})
);

// Invite bot
router.get('/invite', (req, res) => {
	const url = `${DISCORD_API}/oauth2/authorize?${stringify({
		client_id: CLIENT_ID,
		permissions: 280095814,
		scope: 'bot',
		...req.query,
	})}`;

	res.redirect(url);
});

export default router;
