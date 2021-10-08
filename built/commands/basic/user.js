"use strict";
const discord_js_1 = require("discord.js");
const command = {
    label: 'user',
    alias: [],
    options: {
        guildOnly: false,
        adminOnly: false,
        information: {
            descr: 'Busca un usuario.',
            short: 'Busca un usuario.',
            usage: '[@Mención]'
        }
    },
    execute: session => (msg, args) => {
        var _a;
        const search = args.join(' ');
        const target = msg.mentions.users.first();
        if (!search && !target)
            return 'Menciona un usuario';
        const user = (_a = session.users.cache.get(search)) !== null && _a !== void 0 ? _a : target;
        if (!user)
            return 'No se encontró el usuario';
        return new discord_js_1.MessageEmbed()
            .setColor('RANDOM')
            .setTitle(user.username)
            .addField('Bot?', user.bot ? 'Sí' : 'No');
    }
};
module.exports = command;
