import mysql from 'mysql2';
import { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } from './enviroment';

const db = mysql.createPool({
	host: DB_HOST,
	port: 3306,
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB_NAME,
	supportBigNumbers: true,
	connectionLimit: 10,
});

export const connectDatabase = async (): Promise<void> => {
	console.log('Connecting to database...');
	await asyncQuery('SELECT 1 + 1 AS result');
};

type QueryResult =
	| mysql.RowDataPacket[]
	| mysql.RowDataPacket[][]
	| mysql.OkPacket
	| mysql.OkPacket[]
	| mysql.ResultSetHeader;

export const asyncQuery = (sql: string, values?: any): Promise<QueryResult> =>
	new Promise((resolve, reject) =>
		db.query(sql, values, (err, results) => {
			if (err) reject(err);
			else resolve(results);
		})
	);

export default db;
