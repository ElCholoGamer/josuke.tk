import { RequestHandler } from 'express';
import mysql from 'mysql';

export const isAdmin = (permissions: number) => (permissions & 0x8) === 0x8;

export const asyncHandler = (handler: RequestHandler): RequestHandler => {
	return async (req, res, next) => {
		try {
			await handler(req, res, next);
		} catch (error) {
			res.status(500).json({
				status: 500,
				error,
			});
			console.error(error);
		}
	};
};

const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
export const db = mysql.createConnection({
	host: DB_HOST,
	port: 3306,
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB_NAME,
	supportBigNumbers: true,
});

export const connectDatabase = (): Promise<mysql.Connection> =>
	new Promise((resolve, reject) => {
		console.log('Connecting to database...');
		db.connect(err => {
			if (err) reject(err.sqlMessage);
			else resolve(db);
		});
	});
