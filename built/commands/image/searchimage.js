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
            usage: '<Search>'
        }
    },
    execute: () => async (msg, args) => {
        const search = args.join(' ');
        if (!search)
            return 'Por favor especifica una búsqueda';
        const results = await image(search);
        if (!results[1])
            return 'No he encontrado resultados';
        const row = new discord_js_1.MessageActionRow()
            .addComponents([
            new discord_js_1.MessageButton()
                .setCustomId('Back')
                .setLabel('⏪')
                .setStyle('PRIMARY')
                .setDisabled(true),
            new discord_js_1.MessageButton()
                .setCustomId('Next')
                .setLabel('⏩')
                .setStyle('PRIMARY')
                .setDisabled(false),
            new discord_js_1.MessageButton()
                .setCustomId('ExactMatch')
                .setLabel('🔢')
                .setStyle('PRIMARY')
        ]);
        const baseEmbed = new discord_js_1.MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(msg.author.username, msg.author.displayAvatarURL())
            .setImage(results[1].url)
            .setFooter('Page: 1 (first)');
        let query = 1;
        const message = await msg.channel.send({ embeds: [baseEmbed], components: [row] });
        const filter = (i) => (i.customId === 'Back' || i.customId === 'Next' || i.customId === 'ExactMatch') && i.user.id === msg.author.id;
        const collector = message.channel.createMessageComponentCollector({ filter, time: 60 * 1000 });
        collector.on('collect', async (i) => {
            var _a, _b, _c, _d;
            const embed = Object.assign(baseEmbed);
            if (i.customId === 'Back' && message.id === i.message.id) {
                query--;
                const newRow = new discord_js_1.MessageActionRow()
                    .addComponents([
                    new discord_js_1.MessageButton()
                        .setCustomId('Back')
                        .setLabel('⏪')
                        .setStyle('PRIMARY')
                        .setDisabled(query < 1 ? true : false),
                    new discord_js_1.MessageButton()
                        .setCustomId('Next')
                        .setLabel('⏩')
                        .setStyle('PRIMARY')
                        .setDisabled(query > results.length ? true : false),
                    new discord_js_1.MessageButton()
                        .setCustomId('ExactMatch')
                        .setLabel('🔢')
                        .setStyle('PRIMARY')
                ]);
                if (results[query] && results[1])
                    await i.update({ embeds: [embed.setImage((_b = (_a = results[query]) === null || _a === void 0 ? void 0 : _a.url) !== null && _b !== void 0 ? _b : results[1].url).setFooter(`Page: ${query}/${results.length}`)], components: [newRow] });
            }
            else if (i.customId === 'Next' && message.id === i.message.id) {
                query++;
                const newRow = new discord_js_1.MessageActionRow()
                    .addComponents([
                    new discord_js_1.MessageButton()
                        .setCustomId('Back')
                        .setLabel('⏪')
                        .setStyle('PRIMARY')
                        .setDisabled(query < 1 ? true : false),
                    new discord_js_1.MessageButton()
                        .setCustomId('Next')
                        .setLabel('⏩')
                        .setStyle('PRIMARY')
                        .setDisabled(query > results.length ? true : false),
                    new discord_js_1.MessageButton()
                        .setCustomId('ExactMatch')
                        .setLabel('🔢')
                        .setStyle('PRIMARY')
                ]);
                if (results[query] && results[1])
                    await i.update({ embeds: [embed.setImage((_d = (_c = results[query]) === null || _c === void 0 ? void 0 : _c.url) !== null && _d !== void 0 ? _d : results[1].url).setFooter(`Page: ${query}/${results.length}`)], components: [newRow] });
            }
            else if (i.customId === 'ExactMatch' && message.id === i.message.id) {
                const m = await msg.reply(`Please send a number beetween 0 and ${results.length}`);
                const newRow = new discord_js_1.MessageActionRow()
                    .addComponents([
                    new discord_js_1.MessageButton()
                        .setCustomId('Back')
                        .setLabel('⏪')
                        .setStyle('PRIMARY')
                        .setDisabled(query < 1 ? true : false),
                    new discord_js_1.MessageButton()
                        .setCustomId('Next')
                        .setLabel('⏩')
                        .setStyle('PRIMARY')
                        .setDisabled(query > results.length ? true : false),
                    new discord_js_1.MessageButton()
                        .setCustomId('ExactMatch')
                        .setLabel('🔢')
                        .setStyle('PRIMARY')
                ]);
                const filter = (m) => !isNaN(parseInt(m.content)) && m.author === msg.author;
                const messageCollector = m.channel.createMessageCollector({ filter, time: 15 * 1000 });
                messageCollector.on('collect', async (m) => {
                    const selection = parseInt(m.content);
                    query = selection;
                    const response = results[query];
                    if (!response) {
                        msg.channel.send({ content: 'No se encontró la página' });
                        return;
                    }
                    embed.setImage(response.url);
                    embed.setFooter(`Page: ${query}/${results.length}`);
                    await message.edit({ embeds: [embed], components: [newRow] });
                    return;
                });
                await i.update({ embeds: [embed], components: [newRow] });
            }
        });
    }
};
function image(search) {
    return new Promise((resolve, reject) => {
        (0, g_i_s_1.default)(search, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            if (results)
                resolve([...results.filter(f => f)]);
        });
    });
}
module.exports = command;
