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
    execute: (session) => async (msg, args) => {
        const search = args.join(' ');
        const target = msg.mentions.users.first();
        if (!search)
            return 'Menciona un usuario';
        let user = session.users.cache.get(search);
        if (!user && target)
            user = target;
        if (!user)
            return 'No se encontró el usuario';
        return new discord_js_1.MessageEmbed()
            .setColor('RANDOM')
            .setTitle(user.username)
            .addField('Bot?', user.bot ? 'Sí' : 'No');
    }
};
module.exports = command;
