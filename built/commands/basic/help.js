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
    },
    information: {
        descr: 'Busca información acerca de un comando - muestra todos los comandos.',
        short: 'Busca comandos.',
        usage: '[$Comando]'
    },
    execute: (session) => (msg, args) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
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
                    `- \`${(_c = `[${cmd.label}] ${(_b = (_a = cmd === null || cmd === void 0 ? void 0 : cmd.alias) === null || _a === void 0 ? void 0 : _a.join(', ')) !== null && _b !== void 0 ? _b : ''}`.trim()) !== null && _c !== void 0 ? _c : cmd.label}\``,
                    ` ${(_g = (_e = (_d = cmd === null || cmd === void 0 ? void 0 : cmd.information) === null || _d === void 0 ? void 0 : _d.short) !== null && _e !== void 0 ? _e : (_f = cmd.information) === null || _f === void 0 ? void 0 : _f.descr) !== null && _g !== void 0 ? _g : 'Comando sin descripción'}`
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
                    (_h = (_f = (_e = command.information) === null || _e === void 0 ? void 0 : _e.descr) !== null && _f !== void 0 ? _f : (_g = command.information) === null || _g === void 0 ? void 0 : _g.short) !== null && _h !== void 0 ? _h : 'Comando sin descripción',
                    ((_j = command.information) === null || _j === void 0 ? void 0 : _j.usage) ? `**${options_1.options.prefix}${command.label} ${!command.options.argsRequired && command.options.argsRequired !== true
                        ? '<Args>...'
                        : ''}**`
                        : `**${options_1.options.prefix}${command.label} ${(_k = command.information) === null || _k === void 0 ? void 0 : _k.usage}**`
                ]
            },
            {
                name: 'Cooldown',
                value: (_l = command.cooldown) !== null && _l !== void 0 ? _l : 'Sin cooldown'
            }
        ]);
    })
};
module.exports = command;
