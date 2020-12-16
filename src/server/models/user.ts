import { Document, model, Schema } from 'mongoose';

interface IMultiplier {
	amount: number;
	until: number;
}

const MultiplierSchema = new Schema({
	amount: { type: Number, required: true },
	until: { type: Number, required: true },
});

export interface IUser extends Document {
	balance: number;
	lastDaily: number;
	items: Map<string, number>;
	multipliers: IMultiplier[];
}

const UserSchema = new Schema({
	_id: String,
	balance: { type: Number, required: true, default: 0 },
	lastDaily: { type: Number, required: true, default: 0 },
	items: {
		type: Schema.Types.Map,
		required: true,
		default: {},
	},
	multipliers: {
		type: [MultiplierSchema],
		required: true,
		default: [],
	},
});

const User = model<IUser>('User', UserSchema);

export default User;
