import { Document, model, Schema } from 'mongoose';

export const defaultConfig: IGuildConfig = {
	prefix: 'jo! ',
	snipe: true,
	levels: true,
	sendLevel: true,
	levelMessage: 'Congratulations, {user}, you have reached level {lvl}!',
	lang: 'en-us',
};

export interface IGuildConfig {
	prefix: string;
	snipe: boolean;
	levels: boolean;
	sendLevel: boolean;
	levelMessage: string;
	lang: string;
}

export interface IMemberStats {
	xp: number;
	level: number;
	totalXp: number;
}

export interface IGuild extends Document {
	config: IGuildConfig;
	members: {
		[id: string]: IMemberStats;
	};
}

const GuildSchema = new Schema({
	_id: String,
	config: {
		type: {
			prefix: String,
			snipe: Boolean,
			levels: Boolean,
			sendLevel: Boolean,
			levelMessage: String,
		},
		required: true,
		default: defaultConfig,
	},
	members: {
		type: Schema.Types.Mixed,
		required: true,
		default: {},
	},
});

const Guild = model<IGuild>('Guild', GuildSchema);

export default Guild;
