import mysql from 'mysql2';
import { env } from 'process';

const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = env;
const db = mysql.createConnection({
	host: DB_HOST,
	port: 3306,
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB_NAME,
	supportBigNumbers: true,
});

export const connectDatabase = (): Promise<void> =>
	new Promise((resolve, reject) => {
		console.log('Connecting to database...');
		db.connect(err => {
			if (err) reject(err.message);
			else resolve();
		});
	});

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
