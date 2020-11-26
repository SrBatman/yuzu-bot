// TODO

import type { Client, User, Guild, Channel } from 'discord.js';

export async function shardedUsers(client: Client) {
    const entries = (await client.shard?.broadcastEval('client.users.cache.entries()') as [string, User][][]);

    const output = new Map<string, User>();
    for (const [ entry ] of entries) {
        output.set(entry?.[0]!, entry?.[1]!)
        return output;
    }
    return output;
}

export async function shardedGuilds(client: Client) {
    const entries = (await client.shard?.broadcastEval('client.guilds.cache.entries()') as [string, Guild][][]);

    const output = new Map<string, Guild>();
    for (const [ entry ] of entries) {
        output.set(entry?.[0]!, entry?.[1]!)
        return output;
    }
    return output;
}

export async function shardedChannels(client: Client) {
    const entries = (await client.shard?.broadcastEval('client.channels.cache.entries()') as [string, Channel][][]);

    const output = new Map<string, Channel>();
    for (const [ entry ] of entries) {
        output.set(entry?.[0]!, entry?.[1]!)
        return output;
    }
    return output;
}
