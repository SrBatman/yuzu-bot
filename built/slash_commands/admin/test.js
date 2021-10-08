"use strict";
const builders_1 = require("@discordjs/builders");
const command = {
    options: {
        guildOnly: false,
        adminOnly: false,
        information: {
            descr: 'Ping',
            short: 'Ping',
            usage: ''
        }
    },
    data: new builders_1.SlashCommandBuilder()
        .setName('test')
        .setDescription('Replies with pong!'),
    execute(i) {
        return `pong! \\🏓 ${Math.floor(i.client.ws.ping)}ms`;
    }
};
module.exports = command;
