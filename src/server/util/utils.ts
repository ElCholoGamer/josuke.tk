/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
import { RequestHandler } from 'express';
import webpush from 'web-push';
import {
	VAPID_SUBJECT,
	VAPID_PUBLIC_KEY,
	VAPID_PRIVATE_KEY,
	BOT_TOKEN,
	CLIENT_ID,
} from './enviroment';
import { asyncExecute } from './db';
import axios from 'axios';

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const ADMIN = 0x00000008;
export const isAdmin = (permissions: number) => (permissions & ADMIN) === ADMIN;

export const asyncHandler = (handler: RequestHandler): RequestHandler => async (
	req,
	res,
	next
) => {
	try {
		await handler(req, res, next);
	} catch (err) {
		next(new Error(err));
	}
};

export const stringify = (o: any) =>
	Object.entries(o)
		.map(([key, value]) => `${key}=${value}`)
		.join('&');

export const notify = async (title: string, options?: any) => {
	const subscriptions = await asyncExecute('SELECT * FROM push_subscriptions');

	const response = await axios
		.get(`${DISCORD_API}/users/@me`, {
			headers: { Authorization: `Bot ${BOT_TOKEN}` },
		})
		.catch((err: any) => ({ status: err.response.data, data: {} }));

	// Get bot avatar URL
	const icon =
		response.status !== 200
			? ''
			: (({ avatar, discriminator }) =>
					`https://cdn.discord.com/${
						avatar
							? `avatars/${CLIENT_ID}/${avatar}`
							: `embed/avatars/${discriminator % 5}`
					}.png`)(response.data);

	const notification = {
		title,
		options: {
			icon,
			...options,
		},
	};

	await Promise.all(
		subscriptions.map(row =>
			webpush.sendNotification(row.subscription, JSON.stringify(notification))
		)
	);
};

export const DISCORD_API = 'https://discord.com/api';
