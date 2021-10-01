"use strict";
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const g_i_s_1 = (0, tslib_1.__importDefault)(require("g-i-s"));
const command = {
    label: 'image',
    alias: ['img', 'im', 'i'],
    options: {
        guildOnly: false,
        adminOnly: false,
        information: {
            descr: 'Busca imágenes en Google.',
            short: 'Busca imágenes en Google.',
            usage: 'image <$Search>'
        }
    },
    execute: () => (msg, args) => {
        const search = args.join(' ');
        if (!search)
            return 'Por favor especifica una búsqueda.';
        (0, g_i_s_1.default)(search, (error, results) => {
            if (error)
                msg.channel.send({ content: error.message });
            if (results[0])
                return new discord_js_1.MessageEmbed()
                    .setColor('RANDOM')
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL())
                    .setImage(results[0].url);
            else
                return undefined;
        });
        return undefined;
    }
};
module.exports = command;
