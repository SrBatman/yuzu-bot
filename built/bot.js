"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.events = exports.aliases = exports.commands = exports.slashCommands = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const path_1 = require("path");
const discord_js_1 = require("discord.js");
const options_1 = (0, tslib_1.__importDefault)(require("./options"));
const superagent_1 = (0, tslib_1.__importDefault)(require("superagent"));
require("./database/db");
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
class Main {
    static handleApiCommands(commands) {
        const api = 'https://nekos.life/api/v2/';
        const endpoints = [
            'img/hug',
            'img/kiss',
            'img/poke',
            'img/tickle',
            'img/pat',
            'img/cuddle',
            'img/punch'
        ];
        endpoints.forEach(cmd => {
            const commandName = cmd.slice(4, cmd.length);
            console.log('Loaded command %s', commandName);
            commands.set(commandName, {
                label: commandName,
                options: {
                    guildOnly: false,
                    adminOnly: false,
                    information: {
                        descr: `Action: ${commandName}`,
                        usage: `[@User]`,
                        short: `Action: ${commandName}`
                    }
                },
                cooldown: 4,
                execute: session => async (msg) => {
                    var _b, _c, _d;
                    const getDescription = (action, author, member) => `${author.toString()} received a ${action} from ${member.toString()}`;
                    const url = (await superagent_1.default.get(api + cmd)).body.url;
                    if (!url)
                        return 'No encontré una imagen para mostrar';
                    if (!msg.guild && session.user)
                        return new discord_js_1.MessageEmbed()
                            .setDescription(getDescription(commandName, msg.author, session.user))
                            .setColor('RANDOM')
                            .setImage(url);
                    if (!((_b = msg.guild) === null || _b === void 0 ? void 0 : _b.me))
                        return;
                    if (!msg.member)
                        return;
                    const member = (_d = (_c = msg.mentions.members) === null || _c === void 0 ? void 0 : _c.first()) !== null && _d !== void 0 ? _d : msg.guild.me;
                    return new discord_js_1.MessageEmbed()
                        .setDescription(getDescription(commandName, msg.member, member))
                        .setColor('RANDOM')
                        .setImage(url);
                }
            });
        });
    }
    static handleEvents(folder, session, events) {
        const path = (0, path_1.join)(__dirname, folder);
        (0, fs_1.readdirSync)(path).forEach(async (file) => {
            if (!file.endsWith('.js')) {
                const unknownFile = (0, path_1.join)(folder, file);
                Main.handleEvents(unknownFile, session, events);
                return;
            }
            const eventFile = (0, path_1.join)(__dirname, folder, file);
            const event = await Promise.resolve().then(() => (0, tslib_1.__importStar)(require(eventFile)));
            session[event.once ? 'once' : 'on'](event.label, (...args) => event.execute(...args));
            events.set(event.label, event);
            console.log('Loaded event %s', event.label);
        });
    }
    static handleCommands(folder, commands, aliases) {
        const path = (0, path_1.join)(__dirname, folder);
        (0, fs_1.readdirSync)(path).forEach(async (file) => {
            var _b, _c;
            if (!file.endsWith('.js')) {
                const unknownFile = (0, path_1.join)(folder, file);
                Main.handleCommands(unknownFile, commands, aliases);
                return;
            }
            const commandFile = (0, path_1.join)(__dirname, folder, file);
            const command = await Promise.resolve().then(() => (0, tslib_1.__importStar)(require(commandFile)));
            if ((_b = command.options) === null || _b === void 0 ? void 0 : _b.disabled)
                return;
            (_c = command.alias) === null || _c === void 0 ? void 0 : _c.forEach(alias => aliases.set(alias, command.label));
            commands.set(command.label, command);
            console.log('Loaded command %s', command.label);
        });
    }
}
_a = Main;
Main.events = new Map;
Main.commands = new Map;
Main.aliases = new Map;
Main.slashCommands = new Map;
Main.session = new discord_js_1.Client({
    intents: [
        discord_js_1.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        discord_js_1.Intents.FLAGS.DIRECT_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILDS
    ],
    presence: {
        status: 'online',
        activities: [{ name: options_1.default.Prefix, type: discord_js_1.Constants.ActivityTypes.LISTENING }]
    }
});
Main.supportGuildId = '891367004903182336';
Main.sessionId = '839719220979695626';
Main.slashCommandsData = [];
(() => {
    const folder = '/slash_commands/admin';
    const path = (0, path_1.join)(__dirname, folder);
    (0, fs_1.readdirSync)(path).filter(file => file.endsWith('.js')).forEach(async (file) => {
        const commandFile = (0, path_1.join)(__dirname, folder, file);
        const command = await Promise.resolve().then(() => (0, tslib_1.__importStar)(require(commandFile)));
        Main.slashCommandsData.push(command.data.toJSON());
        Main.slashCommands.set(command.data.name, command);
        console.log('Logged slash command %s', command.data.name);
    });
    const rest = new rest_1.REST({ version: '9' }).setToken(Main.session.token);
    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');
            await rest.put(v9_1.Routes.applicationGuildCommands(Main.sessionId, Main.supportGuildId), { body: Main.slashCommandsData });
            await rest.put(v9_1.Routes.applicationCommands(Main.sessionId), { body: Main.slashCommandsData });
            console.log('Successfully reloaded application (/) commands.');
        }
        catch (err) {
            console.error('Cannot reload application commands %s', err);
        }
    })();
})();
(() => {
    Main.session.login();
    Main.session.on('error', console.error);
    Main.session.on('unhandledPromiseRejection', console.error);
})();
(() => {
    Main.handleEvents('/events', Main.session, Main.events);
    Main.handleCommands('/commands', Main.commands, Main.aliases);
    Main.handleApiCommands(Main.commands);
})();
exports.slashCommands = Main.slashCommands;
exports.commands = Main.commands;
exports.aliases = Main.aliases;
exports.events = Main.events;
