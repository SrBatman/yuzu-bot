"use strict";
const command = {
    label: 'ping',
    alias: [],
    options: {
        guildOnly: false,
        adminOnly: false,
        information: {
            descr: 'Ping',
            short: 'Ping',
            usage: ''
        }
    },
    execute: () => () => 'Pong!'
};
module.exports = command;
