import dotenv from 'dotenv';
dotenv.config();

const {
	CLIENT_ID,
	CLIENT_SECRET,
	BOT_TOKEN,
	DB_HOST,
	DB_USER,
	DB_NAME,
	PORT,
} = process.env;

const env = {
	CLIENT_ID,
	CLIENT_SECRET,
	BOT_TOKEN,
	DB_HOST,
	DB_USER,
	DB_NAME,
	PORT,
	NODE_ENV: process.argv.includes('-d') ? 'development' : 'production',
	HEROKU: (process.env._ || '').indexOf('heroku') !== -1 ? 'true' : 'false',
};

export default env;
