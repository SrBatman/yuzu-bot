"use strict";
const discord_js_1 = require("discord.js");
const command = {
    label: 'emotes',
    alias: [],
    options: {
        guildOnly: true,
        adminOnly: false,
        information: {
            descr: 'Muestra emotes del server, añade y remueve emotes',
            short: 'Muestra emotes del server',
            usage: '[set | del]'
        }
    },
    execute: () => async (msg, args) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const arg = args[0];
        if (arg === 'set') {
            if (!((_a = msg.member) === null || _a === void 0 ? void 0 : _a.permissions.has(discord_js_1.Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS)))
                return 'No tienes permisos suficientes para hacer eso';
            if (!((_c = (_b = msg.guild) === null || _b === void 0 ? void 0 : _b.me) === null || _c === void 0 ? void 0 : _c.permissions.has(discord_js_1.Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS)))
                return 'No tengo permisos';
            const [, name, url] = args;
            const roles = msg.mentions.roles;
            if (!name)
                return 'Debes especificar el nombre del emoji';
            if (!url)
                return 'Debes especificar la imagen del emoji';
            const emoji = await ((_d = msg.guild) === null || _d === void 0 ? void 0 : _d.emojis.create(url, name, { roles }).catch((err) => console.error(err)));
            return `Creé ${emoji === null || emoji === void 0 ? void 0 : emoji.name} para el server ${emoji === null || emoji === void 0 ? void 0 : emoji.guild.name} ${emoji === null || emoji === void 0 ? void 0 : emoji.toString()}`;
        }
        if (arg === 'del') {
            if (!((_e = msg.member) === null || _e === void 0 ? void 0 : _e.permissions.has([discord_js_1.Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS, discord_js_1.Permissions.FLAGS.ADMINISTRATOR])))
                return 'No tienes permisos suficientes para hacer eso';
            if (!((_g = (_f = msg.guild) === null || _f === void 0 ? void 0 : _f.me) === null || _g === void 0 ? void 0 : _g.permissions.has(discord_js_1.Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS)))
                return 'No tengo permisos';
            const [, name] = args;
            const emoji = await ((_h = msg.guild) === null || _h === void 0 ? void 0 : _h.emojis.cache.find(e => e.name === name));
            if (!emoji)
                return 'No se encontrò el emoji';
            const deleted = await emoji.delete().catch((err) => console.error(err));
            return `Removì ${deleted === null || deleted === void 0 ? void 0 : deleted.name} para el server ${emoji === null || emoji === void 0 ? void 0 : emoji.guild.name}`;
        }
        return new discord_js_1.MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`Emotes: ${(_j = msg.guild) === null || _j === void 0 ? void 0 : _j.emojis.cache.map(e => e.toString()).join(' ')}`);
    }
};
module.exports = command;
