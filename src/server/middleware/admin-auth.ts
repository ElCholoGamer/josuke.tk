import { RequestHandler } from 'express';

const adminAuth: RequestHandler = (req, res, next) => {
	const { authorization } = req.headers;
	if (authorization !== process.env.ADMIN_PASSWORD)
		return res.status(403).json({
			status: 403,
			message: 'Invalid "authorization" header in request',
		});

	next();
};

export default adminAuth;
