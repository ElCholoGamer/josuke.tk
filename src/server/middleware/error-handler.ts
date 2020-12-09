import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res) => {
	console.error(err);

	res.status(500).json({
		status: 500,
		error: err.message || '[no message]',
	});
};

export default errorHandler;
