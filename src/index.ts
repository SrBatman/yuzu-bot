import { ShardingManager } from 'discord.js';
import 'dotenv/config';

const manager = new ShardingManager('./built/bot.js', { token: process.env.token });

manager.on('shardCreate', shard => console.log('Launched shard %d', shard.id));
manager.spawn();