"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.session = exports.events = exports.aliases = exports.commands = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = tslib_1.__importDefault(require("discord.js"));
const command_handler_1 = tslib_1.__importDefault(require("./command-handler"));
const event_handler_1 = tslib_1.__importDefault(require("./event-handler"));
require("./database/db");
require("./structures/Guild");
require("process");
exports.commands = new Map(), exports.aliases = new Map(), exports.events = new Map(), exports.session = new discord_js_1.default.Client();
event_handler_1.default('/events', exports.session, exports.events);
command_handler_1.default('/commands', exports.commands, exports.aliases);
const token = process.env.token;
if (token)
    exports.session.login(token);
