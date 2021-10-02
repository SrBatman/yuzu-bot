"use strict";
const discord_js_1 = require("discord.js");
const command = {
    label: 'serverinfo',
    alias: ['sv', 'server'],
    options: {
        guildOnly: true,
        adminOnly: false,
        information: {
            descr: 'Busca información acerca del servidor.',
            short: 'Ver el servidor.',
            usage: '...'
        }
    },
    execute: () => (msg) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        const channels = {
            'text': (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').size,
            'voice': (_b = msg.guild) === null || _b === void 0 ? void 0 : _b.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').size
        };
        const bots = (_c = msg.guild) === null || _c === void 0 ? void 0 : _c.members.cache.filter(member => member.user.bot).size;
        const members = (_d = msg.guild) === null || _d === void 0 ? void 0 : _d.members.cache.filter(member => !member.user.bot).size;
        return new discord_js_1.MessageEmbed()
            .setAuthor((_f = (_e = msg.guild) === null || _e === void 0 ? void 0 : _e.name) !== null && _f !== void 0 ? _f : 'No reconocido', (_h = (_g = msg.guild) === null || _g === void 0 ? void 0 : _g.iconURL()) !== null && _h !== void 0 ? _h : msg.author.displayAvatarURL())
            .setColor('RANDOM')
            .setThumbnail((_k = (_j = msg.guild) === null || _j === void 0 ? void 0 : _j.iconURL()) !== null && _k !== void 0 ? _k : msg.author.displayAvatarURL())
            .setTimestamp()
            .setFooter(`ID: ${(_l = msg.guild) === null || _l === void 0 ? void 0 : _l.id}`)
            .addFields([
            {
                name: 'Roles',
                value: `${(_m = msg.guild) === null || _m === void 0 ? void 0 : _m.roles.cache.filter(x => !x.managed).filter(x => x.name !== '@everyone').map(x => x.toString()).slice(0, 15).join(' ')}...`,
                inline: true
            },
            {
                name: 'Creada',
                value: (_o = msg.guild) === null || _o === void 0 ? void 0 : _o.createdAt.toLocaleString('es'),
                inline: true
            },
            {
                name: 'Bots',
                value: bots.toString(),
                inline: true
            },
            {
                name: 'Members',
                value: members.toString(),
                inline: true
            },
            {
                name: 'Canales',
                value: `**Text**: ${channels.text}\n**Voice**: ${channels.voice}`,
                inline: true
            }
        ]);
    }
};
module.exports = command;
