import mongoose from 'mongoose';
import { ATLAS_URI } from './enviroment';

export const connect = () =>
	mongoose.connect(ATLAS_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

const { connection: db } = mongoose;
export default db;
