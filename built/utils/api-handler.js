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
    'img/punch',
];
const handle = (commands) => endpoints.forEach(cmd => {
    function getDescription(command, msg, session) {
        var _a;
        const action = command.slice(4, command.length), author = msg.author, member = (_a = msg.mentions.users.first()) !== null && _a !== void 0 ? _a : session.user;
        const desc = `${author} received a ${action} from ${member}`;
        return desc;
    }
    const commandName = cmd.slice(4, cmd.length);
    console.log('Loaded command %s', commandName);
    commands.set(commandName, {
        label: commandName,
        options: {
            guildOnly: true,
            adminOnly: false,
            information: {
                descr: `${commandName} command`,
                usage: `${commandName} [@User]`,
                short: `${commandName} command`
            },
        },
        cooldown: 3,
        execute: (session) => (msg) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            return new discord_js_1.MessageEmbed()
                .setDescription(getDescription(cmd, msg, session))
                .setColor('RANDOM')
                .setImage((yield superagent_1.default.get(API + cmd)).body.url);
        })
    });
});
module.exports = handle;
