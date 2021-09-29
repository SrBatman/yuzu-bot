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
        },
    },
    execute: (session) => (msg, args) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const search = args.join(' '), BACK = '⬅️', NEXT = '➡️', DELT = '🗑️';
        var page = 0;
        if (!search) {
            return 'Por favor especifica una búsqueda.';
        }
        (0, g_i_s_1.default)(search, (error, results) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            var _a, _b;
            if (error)
                msg.channel.send(error.message, { code: 'js' });
            if ((_b = (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.me) === null || _b === void 0 ? void 0 : _b.permissions.has('ADD_REACTIONS')) {
                yield msg.react('✅');
                if (!results[0])
                    return;
                const embed = new discord_js_1.MessageEmbed();
                embed.setColor('RANDOM');
                embed.setAuthor(msg.author.username, msg.author.displayAvatarURL());
                embed.setImage(results[0].url);
                embed.setFooter('Page 1/50');
                const sended = yield msg.channel.send(embed);
                yield sended.react(BACK);
                yield sended.react(NEXT);
                yield sended.react(DELT);
                yield awaitR(sended, sended.author);
            }
            function awaitR(m, author) {
                var _a;
                return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
                    const removeR = (m) => m.reactions.cache.filter((r) => r.users.cache.has(author.id));
                    const filter = (reaction, user) => {
                        var _a;
                        return [BACK, NEXT, DELT].includes(reaction.emoji.name)
                            && user.id === msg.author.id
                            && user.id !== ((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id);
                    };
                    const update = function (m, page) {
                        var _a;
                        const newEmbed = Object.create(m.embeds[0]);
                        newEmbed.setImage((_a = results === null || results === void 0 ? void 0 : results[page]) === null || _a === void 0 ? void 0 : _a.url);
                        newEmbed.setFooter(`Page: ${page + 1}/${results.length}`);
                        return m.edit(newEmbed);
                    };
                    const collected = yield m.awaitReactions(filter, { max: 1, time: 60 * 1000, errors: ['time'] });
                    switch ((_a = collected.first()) === null || _a === void 0 ? void 0 : _a.emoji.name) {
                        case BACK:
                            if (page !== 0) {
                                page--;
                            }
                            update(m, page);
                            removeR(m);
                            yield awaitR(m, author);
                            break;
                        case NEXT:
                            if (page !== 50) {
                                page++;
                            }
                            update(m, page);
                            removeR(m);
                            yield awaitR(m, author);
                            break;
                        case DELT:
                            m.delete();
                            break;
                        default:
                            yield awaitR(m, author);
                            break;
                    }
                });
            }
            ;
        }));
    })
};
module.exports = command;