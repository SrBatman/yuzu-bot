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
    execute: (session) => () => `pong! \\🏓 ${Math.floor(session.ws.ping)}ms`
};
module.exports = command;
