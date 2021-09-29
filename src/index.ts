import { ShardingManager } from 'discord.js';
import 'dotenv/config';

const manager = new ShardingManager('./built/bot.js', {
	token: process.env.TOKEN,
	mode: 'worker',
});

manager.on('shardCreate', shard => console.log('Launched shard %d', shard.id));
manager.spawn('auto', 15000, -1);