import mongoose, { Document } from 'mongoose';

export const PrefixSchema = new mongoose.Schema<string>({
	id: mongoose.Schema.Types.ObjectId,
	prefix: String,
	server: String
});

export interface IPrefix extends Document {
	id: mongoose.Schema.Types.ObjectId;
	prefix: string;
	server: string;
}

export default mongoose.model<IPrefix>('Prefix', PrefixSchema, 'prefixes');