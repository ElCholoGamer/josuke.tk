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
		next(new Error(err));
	}
};

export const stringify = (o: any) =>
	Object.keys(o)
		.map(key => `${key}=${o[key]}`)
		.join('&');
