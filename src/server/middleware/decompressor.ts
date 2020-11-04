import express from 'express';

const decompressor: express.RequestHandler = (req, res, next) => {
	req.url += '.gz';
	res.setHeader('Content-Encoding', 'gzip');
	next();
};

export default decompressor;
