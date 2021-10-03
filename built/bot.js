"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventFiles = exports.commandAliases = exports.commandFiles = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const api_handler_1 = (0, tslib_1.__importDefault)(require("./utils/api-handler"));
const fs_1 = require("fs");
const path_1 = require("path");
require("./database/db");
exports.commandFiles = new Map();
exports.commandAliases = new Map();
exports.eventFiles = new Map();
const session = new discord_js_1.Client({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.DIRECT_MESSAGES,
        discord_js_1.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        discord_js_1.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        discord_js_1.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS
    ]
});
session.login();
session.on('error', console.error);
session.on('unhandledPromiseRejection', console.error);
handleEvents('/events', exports.eventFiles, session);
handleCommands('/commands', exports.commandFiles, exports.commandAliases);
(0, api_handler_1.default)(exports.commandFiles);
function handleEvents(folder, events, s) {
    (0, fs_1.readdirSync)((0, path_1.join)(__dirname, folder)).forEach(async (file) => {
        if (!file.endsWith('.js')) {
            handleEvents((0, path_1.join)(folder, file), events, s);
            return;
        }
        const event = await Promise.resolve().then(() => (0, tslib_1.__importStar)(require((0, path_1.join)(__dirname, folder, file))));
        s[event.once ? 'once' : 'on'](event.label, (...args) => event.execute(...args));
        events.set(event.label, event);
        console.log('Loaded event %s', event.label);
    });
}
function handleCommands(folder, commands, aliases) {
    (0, fs_1.readdirSync)((0, path_1.join)(__dirname, folder)).forEach(async (file) => {
        var _a, _b, _c;
        if (!file.endsWith('.js')) {
            handleCommands((0, path_1.join)(folder, file), commands, aliases);
            return;
        }
        const command = await Promise.resolve().then(() => (0, tslib_1.__importStar)(require((0, path_1.join)(__dirname, folder, file))));
        (_a = command.alias) === null || _a === void 0 ? void 0 : _a.forEach(alias => { var _a; return aliases.set(alias, (_a = command.label) !== null && _a !== void 0 ? _a : file); });
        commands.set((_b = command.label) !== null && _b !== void 0 ? _b : file, command);
        console.log('Loaded command %s', (_c = command.label) !== null && _c !== void 0 ? _c : file);
    });
}
