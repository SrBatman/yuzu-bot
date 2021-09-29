"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
require("dotenv/config");
const manager = new discord_js_1.ShardingManager('./built/bot.js', {
    token: process.env.TOKEN,
    mode: 'worker',
});
manager.on('shardCreate', shard => console.log('\x1b[32m%s\x1b[0m', `Launched shard ${shard.id}`));
manager.spawn();
