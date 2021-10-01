"use strict";
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const bot_1 = require("../../bot");
const options_1 = (0, tslib_1.__importDefault)(require("../../options"));
const command = {
    label: 'help',
    alias: ['h'],
    options: {
        guildOnly: false,
        adminOnly: false,
        information: {
            descr: 'Busca información acerca de un comando - muestra todos los comandos.',
            short: 'Busca comandos.',
            usage: '[$Comando]'
        }
    },
    cooldown: 5,
    execute: (session) => (msg, args) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        const search = args.join(' ');
        const base = new discord_js_1.MessageEmbed()
            .setColor('RANDOM')
            .setThumbnail(msg.author.displayAvatarURL())
            .setTimestamp()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL())
            .setDescription(`El prefix del bot es ${options_1.default.prefix}`);
        if (!search) {
            const info = [...bot_1.commandFiles.values()]
                .map(c => {
                var _a, _b, _c, _d, _e, _f, _g;
                return [
                    `- \`${(_a = `[${c.label}] ${(c === null || c === void 0 ? void 0 : c.alias) ? c.alias.join(', ') : ''}`.trim()) !== null && _a !== void 0 ? _a : c.label}\``,
                    ` ${(_g = (_d = (_c = (_b = c === null || c === void 0 ? void 0 : c.options) === null || _b === void 0 ? void 0 : _b.information) === null || _c === void 0 ? void 0 : _c.short) !== null && _d !== void 0 ? _d : (_f = (_e = c.options) === null || _e === void 0 ? void 0 : _e.information) === null || _f === void 0 ? void 0 : _f.descr) !== null && _g !== void 0 ? _g : 'Comando sin descripción'}`
                ];
            });
            return Object.assign(base)
                .setTitle(String.raw `\👾 Comandos de ${(_a = session.user) === null || _a === void 0 ? void 0 : _a.tag}`)
                .setColor('RANDOM')
                .setDescription([(_b = base.description) !== null && _b !== void 0 ? _b : 'sin descripción...', ...info].join('\n'));
        }
        const cmd = bot_1.commandFiles.get(search);
        if (!cmd)
            return 'No encontré ese comando.';
        return Object.assign(base)
            .setTitle('Información del comando.')
            .addFields([
            {
                name: 'Nombre del comando',
                value: (_c = cmd.label) !== null && _c !== void 0 ? _c : '???'
            },
            {
                name: 'Alias',
                value: !cmd.alias ? 'sin alias' : cmd.alias.length > 0 ? cmd.alias.join(' ') : 'sin alias'
            },
            {
                name: 'Información y uso del comando',
                value: [
                    (_j = (_f = (_e = (_d = cmd.options) === null || _d === void 0 ? void 0 : _d.information) === null || _e === void 0 ? void 0 : _e.descr) !== null && _f !== void 0 ? _f : (_h = (_g = cmd.options) === null || _g === void 0 ? void 0 : _g.information) === null || _h === void 0 ? void 0 : _h.short) !== null && _j !== void 0 ? _j : 'Comando sin descripción',
                    (_m = (_l = (_k = cmd.options) === null || _k === void 0 ? void 0 : _k.information) === null || _l === void 0 ? void 0 : _l.usage) !== null && _m !== void 0 ? _m : 'Comando sin información.'
                ].join('\n')
            },
            {
                name: 'Cooldown',
                value: `${(_o = cmd.cooldown) !== null && _o !== void 0 ? _o : 3}`
            }
        ]);
    }
};
module.exports = command;
