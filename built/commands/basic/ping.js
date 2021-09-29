"use strict";
var Command;
(function (Command) {
    Command.command = {
        label: 'ping',
        alias: [],
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
})(Command || (Command = {}));
module.exports = Command.command;
