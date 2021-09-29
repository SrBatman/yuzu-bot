"use strict";
const builders_1 = require("@discordjs/builders");
const command = {
    data: new builders_1.SlashCommandBuilder()
        .setDescription('Ping')
        .setName('ping'),
    label: 'ping',
    alias: ['pfp', 'pic'],
    options: {
        guildOnly: false,
        adminOnly: false,
        information: {
            descr: 'Ping',
            short: 'Ping',
            usage: ''
        },
    },
    execute: () => () => 'Pong!'
};
module.exports = command;
