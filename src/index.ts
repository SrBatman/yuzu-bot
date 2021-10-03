import { ShardingManager } from 'discord.js';
import 'dotenv/config';

const manager = new ShardingManager('./built/bot.js', { token: process.env.TOKEN, mode: 'worker' });

manager.on('shardCreate', shard => console.log('Launched shard %s', shard.id));
manager.spawn({ amount: 'auto' });