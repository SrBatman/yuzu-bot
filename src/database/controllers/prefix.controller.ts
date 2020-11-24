import Prefix, { IPrefix } from '../models/prefix.model';
import { Types } from 'mongoose';

export async function add({ prefix, server }: { prefix: string, server: string }) {
	const newPrefix: IPrefix = new Prefix({
		id: Types.ObjectId(),
		prefix: prefix,
		server: server
	});
	return await newPrefix.save();
};
export async function remove(prefix: IPrefix) { // FIXME
	const output = await Prefix.deleteOne({ server: prefix.server });
	return output;
};
export async function edit(before: IPrefix, { prefix, server }: { prefix: string, server: string }) {
	const output = await Prefix.update(before, { prefix: prefix, server: server });
	return output;
};
export async function get(server: string) {
	const output = await Prefix.findOne({ server });
	return output;
};