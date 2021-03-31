"use strict";
const discord_js_1 = require("discord.js");
const command = {
    label: 'avatar',
    alias: ['pfp', 'pic'],
    options: {
        guildOnly: false,
        adminOnly: false,
    },
    information: {
        descr: 'Busca el avatar de un usuario.',
        short: 'Busca avatares.',
        usage: '[@Mención]'
    },
    execute: () => (msg) => {
        var _a;
        const target = (_a = msg.mentions.users.first()) !== null && _a !== void 0 ? _a : msg.author;
        const avatar = target.displayAvatarURL({ size: 1024, dynamic: true, format: 'png' || 'gif' });
        return new discord_js_1.MessageEmbed()
            .setAuthor(target.tag, avatar)
            .setColor(msg.member ? msg.member.displayColor : 'RANDOM')
            .setTitle(`Avatar pedido por ${msg.author.tag}`)
            .setDescription([
            `[Referencia](https://www.google.com/searchbyimage?image_url=${avatar})`,
            `[Avatar URL](${avatar})`
        ])
            .setImage(avatar);
    }
};
module.exports = command;
