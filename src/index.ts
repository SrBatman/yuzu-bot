import { ShardingManager } from 'discord.js';
import 'dotenv/config';

const manager = new ShardingManager('./built/bot.js', {
	token: process.env.TOKEN,
	mode: 'worker',
});

manager.on('shardCreate', shard => console.log('\x1b[32m%s\x1b[0m', `Launched shard ${shard.id}`));
manager.spawn();