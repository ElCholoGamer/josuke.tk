import mysql from 'mysql';

const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
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
			if (err) reject(err.sqlMessage);
			else resolve();
		});
	});

export const asyncQuery = (
	options: string | mysql.QueryOptions,
	values?: any
): Promise<any> =>
	new Promise((resolve, reject) =>
		db.query(options, values, (err, results) => {
			if (err) reject(err);
			else resolve(results);
		})
	);

export default db;
