"use strict";
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const bot_1 = require("../../bot");
const options_1 = require("../../options");
require("../../structures/Guild");
const command = {
    label: 'help',
    alias: ['h'],
    options: {
        guildOnly: false,
        adminOnly: false,
        information: {
            descr: 'Busca información acerca de un comando - muestra todos los comandos.',
            short: 'Busca comandos.',
            usage: '[$Comando]',
        },
    },
    execute: (session) => (msg, args) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const search = args.join(' ');
        const base = new discord_js_1.MessageEmbed()
            .setColor('RANDOM')
            .setThumbnail(msg.author.displayAvatarURL())
            .setTimestamp()
            .setAuthor(msg.guild ? (_a = msg.member) === null || _a === void 0 ? void 0 : _a.displayName : msg.author.username, msg.author.displayAvatarURL())
            .setDescription([
            'Comando de ayuda para pelotudos',
            `El prefix del bot es ${!msg.guild ? options_1.options.prefix : (yield msg.guild.getPrefix()).prefix}`
        ]);
        if (!search) {
            const info = [...bot_1.commands.values()]
                .map(cmd => {
                var _a, _b, _c, _d, _e, _f, _g;
                return [
                    `- \`${(_a = `[${cmd.label}] ${(cmd === null || cmd === void 0 ? void 0 : cmd.alias) ? cmd.alias.join(', ') : ''}`.trim()) !== null && _a !== void 0 ? _a : cmd.label}\``,
                    ` ${(_g = (_d = (_c = (_b = cmd === null || cmd === void 0 ? void 0 : cmd.options) === null || _b === void 0 ? void 0 : _b.information) === null || _c === void 0 ? void 0 : _c.short) !== null && _d !== void 0 ? _d : (_f = (_e = cmd.options) === null || _e === void 0 ? void 0 : _e.information) === null || _f === void 0 ? void 0 : _f.descr) !== null && _g !== void 0 ? _g : 'Comando sin descripción'}`
                ];
            });
            return Object.assign(base)
                .setTitle(String.raw `\👾 Comandos de ${(_b = session.user) === null || _b === void 0 ? void 0 : _b.tag}`)
                .setColor('RANDOM')
                .setDescription([base.description, ...info]);
        }
        const command = bot_1.commands.get(search);
        if (!command)
            return 'No encontré ese comando.';
        return Object.assign(base)
            .setTitle('Información del comando.')
            .addFields([
            {
                name: 'Nombre del comando',
                value: command.label
            },
            {
                name: 'Alias',
                value: !command.alias ? 'sin alias' : command.alias.length > 0 ? command.alias.join(' ') : 'sin alias'
            },
            {
                name: 'Información y uso del comando',
                value: [
                    (_h = (_e = (_d = (_c = command.options) === null || _c === void 0 ? void 0 : _c.information) === null || _d === void 0 ? void 0 : _d.descr) !== null && _e !== void 0 ? _e : (_g = (_f = command.options) === null || _f === void 0 ? void 0 : _f.information) === null || _g === void 0 ? void 0 : _g.short) !== null && _h !== void 0 ? _h : 'Comando sin descripción',
                    (_l = (_k = (_j = command.options) === null || _j === void 0 ? void 0 : _j.information) === null || _k === void 0 ? void 0 : _k.usage) !== null && _l !== void 0 ? _l : 'Comando sin información.'
                ]
            },
            {
                name: 'Cooldown',
                value: (_m = command.cooldown) !== null && _m !== void 0 ? _m : 3
            }
        ]);
    })
};
module.exports = command;
