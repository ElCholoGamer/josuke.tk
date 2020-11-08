import { RequestHandler } from 'express';
import { ADMIN_PASSWORD } from '../util/enviroment';

const adminAuth: RequestHandler = (req, res, next) => {
	const { authorization } = req.headers;
	if (!authorization)
		return res.status(403).json({
			status: 403,
			message: 'Missing "Authorization" header in request',
		});

	if (authorization !== ADMIN_PASSWORD)
		return res.status(403).json({
			status: 403,
			message: 'Invalid "Authorization" header in request',
		});

	next();
};

export default adminAuth;
