import Tag, { ITag } from '../models/tag.model';
import { Types } from 'mongoose';

export async function add(server: string, user: string, content: string, name: string, attachments?: string[]): Promise<ITag> {
	const newTag: ITag = new Tag({
		id: Types.ObjectId(),
		server: server,
		user: user,
		name: name,
		content: content,
		attachments: attachments,
		global: false,
		nsfw: false
	});
	return await newTag.save();
}

export async function remove(server: string, user: string, name: string): Promise<ITag | null> {
	const output = await Tag.findOneAndDelete({ server, user, name });
	return output;
}

export async function pass(tag: ITag, { server, user }: { server: string, user: string }, nsfw = false, global = false) {
	const finded = {
		server: tag.server,
		user: tag.user,
		name: tag.name
	};
	const edited = {
		server: server,
		user: user,
		global: global,
		nsfw: nsfw
	};
	const output = Tag.findOneAndUpdate(finded, edited, { new: true });
	return output;
}

export async function edit(tag: ITag, { content, attachments }: { content: string, attachments: string[] }, global = false, nsfw = false): Promise<ITag | null> {
	const finded = {
		server: tag.server,
		user: tag.user,
		name: tag.name
	};
	const edited = {
		content: content,
		attachments: attachments,
		global: global,
		nsfw: nsfw
	};
	const output = Tag.findOneAndUpdate(finded, edited, { new: true });
	return output;
}

export async function get(name: string, server?: string): Promise<ITag | null> {
	const output = await Tag.findOne({ name: name, global: true }) ?? await Tag.findOne({ name, server });
	return output;
}

export async function find(server: string, user: string): Promise<ITag[]> {
	const output = await Tag.find({ user, server });
	return output;
}