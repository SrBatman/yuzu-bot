import Prefix, { IPrefix } from '../models/prefix.model';
import { Types } from 'mongoose';

export async function add({ prefix, server }: { prefix: string, server: string }) {
	const newPrefix = new Prefix({
		id: Types.ObjectId(),
		prefix: prefix,
		server: server
	});
	return await newPrefix.save();
};
// export async function remove(prefix: IPrefix) { // FIXME
// 	await Prefix.deleteOne({ server: prefix.server });
// };
export async function edit(before: IPrefix, prefix: string, server: string) {
	await Prefix.updateOne({ before }, { prefix, server });
	return await get(server);
};
export async function get(server: string) {
	const output = await Prefix.findOne({ server });
	return output;
};