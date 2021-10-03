import Prefix, { IPrefix } from '../models/prefix.model';
import { Types } from 'mongoose';

export async function add({ prefix, server }: { prefix: string, server: string }): Promise<IPrefix> {
	const newPrefix = new Prefix({
		id: Types.ObjectId(),
		prefix: prefix,
		server: server
	});
	const output = await newPrefix.save();
	return output;
}
export async function edit(before: IPrefix, prefix: string, server: string): Promise<IPrefix | null> {
	await Prefix.findOneAndUpdate(before, { prefix, server }, { new: true });
	const output = await get(server);
	return output;
}
export async function get(server: string): Promise<IPrefix | null> {
	const output = await Prefix.findOne({ server });
	return output;
}