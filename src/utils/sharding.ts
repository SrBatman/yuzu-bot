// TODO

import type { Client, User, Guild, Channel } from 'discord.js';
import { UserManager, GuildManager, ChannelManager } from 'discord.js';

export async function shardedUsers(client: Client): Promise<UserManager> {
    const keys = (await client.shard?.fetchClientValues('client.users.cache.values()') as User[]).map(u => u.id);
    const values = (await client.shard?.fetchClientValues('client.users.cache.values()') as User[]).map(u => u);
    const entries = new Map<string, User>();
    for (const key of keys) for (const value of values) entries.set(key, value);
    return new UserManager(client, entries);
}

export async function shardedGuilds(client: Client): Promise<GuildManager> {
    const keys = (await client.shard?.fetchClientValues('client.guilds.cache.values()') as Guild[]).map(u => u.id);
    const values = (await client.shard?.fetchClientValues('client.guilds.cache.values()') as Guild[]).map(u => u);
    const entries = new Map<string, Guild>();
    for (const key of keys) for (const value of values) entries.set(key, value);
    return new GuildManager(client, entries);
}

export async function shardedChannels(client: Client): Promise<ChannelManager> {
    const keys = (await client.shard?.fetchClientValues('client.channels.cache.values()') as Channel[]).map(u => u.id);
    const values = (await client.shard?.fetchClientValues('client.channels.cache.values()') as Channel[]).map(u => u);
    const entries = new Map<string, Channel>();
    for (const key of keys) for (const value of values) entries.set(key, value);
    return new ChannelManager(client, entries);
}