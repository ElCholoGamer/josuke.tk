import dotenv from 'dotenv';
dotenv.config();

export const {
	CLIENT_ID,
	CLIENT_SECRET,
	BOT_TOKEN,
	ATLAS_URI,
	PORT = 80,
	NODE_ENV = process.argv.includes('-d') ? 'development' : 'production',
	HEROKU = (process.env._ || '').indexOf('heroku') !== -1 ? 'true' : 'false',
	VAPID_SUBJECT,
	VAPID_PUBLIC_KEY,
	VAPID_PRIVATE_KEY,
	ADMIN_PASSWORD,
	DBL_TOKEN,
} = process.env;
