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
            usage: '',
        }
    },
    execute: () => (msg) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        const status = {
            'online': (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.presences.cache.filter(presence => { var _a; return presence.status === 'online' && !((_a = presence.user) === null || _a === void 0 ? void 0 : _a.bot); }).size,
            'idle': (_b = msg.guild) === null || _b === void 0 ? void 0 : _b.presences.cache.filter(presence => { var _a; return presence.status === 'idle' && !((_a = presence.user) === null || _a === void 0 ? void 0 : _a.bot); }).size,
            'dnd': (_c = msg.guild) === null || _c === void 0 ? void 0 : _c.presences.cache.filter(presence => { var _a; return presence.status === 'dnd' && !((_a = presence.user) === null || _a === void 0 ? void 0 : _a.bot); }).size
        };
        const channels = {
            'text': (_d = msg.guild) === null || _d === void 0 ? void 0 : _d.channels.cache.filter(channel => channel.type === 'text').size,
            'voice': (_e = msg.guild) === null || _e === void 0 ? void 0 : _e.channels.cache.filter(channel => channel.type === 'voice').size
        };
        const bots = (_f = msg.guild) === null || _f === void 0 ? void 0 : _f.members.cache.filter(member => member.user.bot).size;
        const members = (_g = msg.guild) === null || _g === void 0 ? void 0 : _g.members.cache.filter(member => !member.user.bot).size;
        return new discord_js_1.MessageEmbed()
            .setAuthor((_h = msg.guild) === null || _h === void 0 ? void 0 : _h.name, (_k = (_j = msg.guild) === null || _j === void 0 ? void 0 : _j.iconURL()) !== null && _k !== void 0 ? _k : msg.author.displayAvatarURL())
            .setColor('RANDOM')
            .setThumbnail((_m = (_l = msg.guild) === null || _l === void 0 ? void 0 : _l.iconURL()) !== null && _m !== void 0 ? _m : msg.author.displayAvatarURL())
            .setTimestamp()
            .addField('Presences', `:green_circle: ${status.online} ㅤ:yellow_circle: ${status.idle} ㅤ:red_circle: ${status.dnd}`)
            .addField('Roles', `${(_o = msg.guild) === null || _o === void 0 ? void 0 : _o.roles.cache.filter(x => !x.managed).filter(x => x.name !== '@everyone').map(x => x.toString()).slice(0, 15).join(' ')}...`)
            .addFields([
            {
                name: 'Creada',
                value: (_p = msg.guild) === null || _p === void 0 ? void 0 : _p.createdAt.toLocaleString('es'),
                inline: true
            },
            {
                name: 'Owner',
                value: (_r = (_q = msg.guild) === null || _q === void 0 ? void 0 : _q.owner) === null || _r === void 0 ? void 0 : _r.displayName,
                inline: true
            },
            {
                name: 'Bots',
                value: bots,
                inline: true
            },
            {
                name: 'Members',
                value: members,
                inline: true
            },
            {
                name: 'Canales',
                value: [
                    `**Text**: ${channels.text}`,
                    `**Voice**: ${channels.voice}`
                ],
                inline: true
            },
            {
                name: 'Región',
                value: REGIONS[(_t = (_s = msg.guild) === null || _s === void 0 ? void 0 : _s.region) !== null && _t !== void 0 ? _t : 'none'],
                inline: true
            }
        ])
            .setFooter(`ID: ${(_u = msg.guild) === null || _u === void 0 ? void 0 : _u.id}`);
    }
};
const REGIONS = {
    'brazil': ':flag_br: Brazil',
    'eu-central': ':flag_eu: Central Europe',
    'singapore': ':flag_sg: Singapore',
    'us-central': ':flag_us: U.S. Central',
    'sydney': ':flag_au: Sydney',
    'us-east': ':flag_us: U.S. East',
    'us-south': ':flag_us: U.S. South',
    'us-west': ':flag_us: U.S. West',
    'eu-west': ':flag_eu: Western Europe',
    'vip-us-east': ':flag_us: VIP U.S. East',
    'london': ':flag_gb: London',
    'amsterdam': ':flag_nl: Amsterdam',
    'hongkong': ':flag_hk: Hong Kong',
    'russia': ':flag_ru: Russia',
    'southafrica': ':flag_za: South Africa',
    'frankfurt': ':flag_de: Frankfurt',
    'dubai': ':flag_ae: Dubai',
    'none': ':x:'
};
module.exports = command;
