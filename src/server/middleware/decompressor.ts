import { RequestHandler } from 'express';

const decompressor: RequestHandler = (req, res, next) => {
	req.url += '.gz';
	res.setHeader('Content-Encoding', 'gzip');
	next();
};

export default decompressor;
