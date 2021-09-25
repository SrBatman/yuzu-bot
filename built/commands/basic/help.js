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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
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
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                return [
                    `- \`${(_c = `[${cmd.label}] ${(_b = (_a = cmd === null || cmd === void 0 ? void 0 : cmd.alias) === null || _a === void 0 ? void 0 : _a.join(', ')) !== null && _b !== void 0 ? _b : ''}`.trim()) !== null && _c !== void 0 ? _c : cmd.label}\``,
                    ` ${(_j = (_f = (_e = (_d = cmd === null || cmd === void 0 ? void 0 : cmd.options) === null || _d === void 0 ? void 0 : _d.information) === null || _e === void 0 ? void 0 : _e.short) !== null && _f !== void 0 ? _f : (_h = (_g = cmd.options) === null || _g === void 0 ? void 0 : _g.information) === null || _h === void 0 ? void 0 : _h.descr) !== null && _j !== void 0 ? _j : 'Comando sin descripción'}`
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
                value: (_d = (_c = command.alias) === null || _c === void 0 ? void 0 : _c.join(', ')) !== null && _d !== void 0 ? _d : 'Sin alias'
            },
            {
                name: 'Información y uso del comando',
                value: [
                    (_k = (_g = (_f = (_e = command.options) === null || _e === void 0 ? void 0 : _e.information) === null || _f === void 0 ? void 0 : _f.descr) !== null && _g !== void 0 ? _g : (_j = (_h = command.options) === null || _h === void 0 ? void 0 : _h.information) === null || _j === void 0 ? void 0 : _j.short) !== null && _k !== void 0 ? _k : 'Comando sin descripción',
                    ((_m = (_l = command.options) === null || _l === void 0 ? void 0 : _l.information) === null || _m === void 0 ? void 0 : _m.usage)
                        ? `**${options_1.options.prefix}${command.label} ${!command.options.argsRequired && command.options.argsRequired !== true
                            ? '<Args>...'
                            : ''}**`
                        : `**${options_1.options.prefix}${command.label} ${(_p = (_o = command.options) === null || _o === void 0 ? void 0 : _o.information) === null || _p === void 0 ? void 0 : _p.usage}**`
                ]
            },
            {
                name: 'Cooldown',
                value: (_q = command.cooldown) !== null && _q !== void 0 ? _q : 'Sin cooldown'
            }
        ]);
    })
};
module.exports = command;
