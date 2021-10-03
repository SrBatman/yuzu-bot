"use strict";
const tslib_1 = require("tslib");
const superagent_1 = (0, tslib_1.__importDefault)(require("superagent"));
const discord_js_1 = require("discord.js");
const API = 'https://nekos.life/api/v2/';
const endpoints = [
    'img/hug',
    'img/kiss',
    'img/poke',
    'img/tickle',
    'img/pat',
    'img/cuddle',
    'img/punch'
];
const handle = (commands) => endpoints.forEach(cmd => {
    function getDescription(command, msg, session) {
        var _a;
        const action = command.slice(4, command.length);
        const author = msg.author;
        const member = (_a = msg.mentions.users.first()) !== null && _a !== void 0 ? _a : session.user;
        return `${author} received a ${action} from ${member}`;
    }
    const commandName = cmd.slice(4, cmd.length);
    console.log('Loaded command %s', commandName);
    commands.set(commandName, {
        label: commandName,
        options: {
            guildOnly: true,
            adminOnly: false,
            information: {
                descr: `Command for giving a ${commandName} to someone`,
                usage: `[@User]`,
                short: `Command for giving a ${commandName}`
            }
        },
        cooldown: 3,
        execute: (session) => async (msg) => new discord_js_1.MessageEmbed()
            .setDescription(getDescription(cmd, msg, session))
            .setColor('RANDOM')
            .setImage((await superagent_1.default.get(API + cmd)).body.url)
    });
});
module.exports = handle;
