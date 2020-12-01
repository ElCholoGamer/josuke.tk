import { RequestHandler } from 'express';

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
		next(err);
	}
};

export const stringify = (obj: any) =>
	Object.keys(obj)
		.map(key => `${key}=${obj[key]}`)
		.join('&');

export const DISCORD_API = 'https://discord.com/api';
