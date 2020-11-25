import { ShardingManager } from 'discord.js';
import { options } from './options';
import { default as start } from './bot';
import 'dotenv/config';

if (options.sharded.isSharded) { // FIXME
	const shard = new ShardingManager('./built/bot.js', { token: process.env.token });
	shard.spawn(1).catch(err => console.error(err));
	shard.on('shardCreate', shard => console.info('Loaded Shard %d!', shard.id));
	console.log('... Sharded bot on');
}
else {
	start().then(token => console.log('Logged ( token: %s )', token.split(token).join(token.replace(/.(?=.{25,}$)/g, '#'))));
}