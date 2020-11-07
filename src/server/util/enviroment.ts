import dotenv from 'dotenv';
dotenv.config();

export const {
	CLIENT_ID,
	CLIENT_SECRET,
	BOT_TOKEN,
	DB_HOST,
	DB_USER,
	DB_NAME,
	PORT = '80',
	DB_PASSWORD,
	NODE_ENV = process.argv.includes('-d') ? 'development' : 'production',
	HEROKU = (process.env._ || '').indexOf('heroku') !== -1 ? 'true' : 'false',
} = process.env;
