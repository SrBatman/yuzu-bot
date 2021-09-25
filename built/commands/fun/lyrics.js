"use strict";
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const superagent_1 = (0, tslib_1.__importDefault)(require("superagent"));
const command = {
    label: 'lyrics',
    alias: ['song', 's'],
    options: {
        guildOnly: false,
        adminOnly: false,
        information: {
            descr: 'Busca la letra e información de una canción.',
            short: 'Busca letras de canciones.',
            usage: '<$Letra>'
        },
    },
    execute: () => (msg, args) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const search = args === null || args === void 0 ? void 0 : args.join(' ');
        if (!search)
            return 'Argumento invalido, escribe algo.';
        const song = yield requestSong(search);
        if (!song)
            return 'No pude encontrar esa canción master.';
        const embed = new discord_js_1.MessageEmbed()
            .setTitle(song.title)
            .setAuthor(song.author, song.icon)
            .setColor('RANDOM');
        if (song.lyrics.length > 2048) {
            for (const line of discord_js_1.Util.splitMessage(song.lyrics)) {
                embed.setFooter(line);
                msg.channel.send(embed);
            }
            return;
        }
        else {
            embed.setFooter(song.lyrics);
        }
        return embed;
    })
};
function requestSong(search) {
    return new Promise((resolve) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const { body } = yield superagent_1.default.get(`https://some-random-api.ml/lyrics/?title=${search}`);
        const song = {
            lyrics: body.lyrics,
            author: body.author,
            title: body.title,
            icon: body.thumbnail.genius
        };
        resolve(song);
    }));
}
module.exports = command;
