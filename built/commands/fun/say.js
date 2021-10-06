"use strict";
const discord_js_1 = require("discord.js");
const command = {
    label: 'say',
    alias: ['esay', 'shadowsay'],
    options: {
        guildOnly: false,
        adminOnly: false,
        information: {
            descr: 'Hace que el bot diga algo muy malo',
            short: 'Escribir el siguiente mensaje del bot.',
            usage: '<Texto>'
        }
    },
    execute: () => (msg, args) => {
        var _a, _b;
        const text = args.join(' ');
        if ((_b = (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.me) === null || _b === void 0 ? void 0 : _b.permissions.has(discord_js_1.Permissions.FLAGS.MANAGE_MESSAGES))
            msg.delete();
        if (!text)
            return 'Escribí el contenido del mensaje o te revoleo a piñas';
        if (text.split(' ').some(l => l === '@everyone' || l === '@here'))
            return 'noup';
        return text;
    }
};
module.exports = command;
