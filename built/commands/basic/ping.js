"use strict";
const command = {
    label: 'ping',
    options: {
        guildOnly: false,
        adminOnly: false,
    },
    execute: () => () => 'Pong!'
};
module.exports = command;
