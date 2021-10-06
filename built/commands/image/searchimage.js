"use strict";
const discord_js_1 = require("discord.js");
const duckduckgo_images_api_1 = require("duckduckgo-images-api");
const command = {
    cooldown: 1,
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
        var _a, _b;
        const search = args.join(' ');
        if (!search)
            return 'Por favor especifica una búsqueda';
        if ((_b = (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.me) === null || _b === void 0 ? void 0 : _b.permissions.has(discord_js_1.Permissions.FLAGS.ADD_REACTIONS))
            await msg.react('✅').catch(err => msg.channel.send(err.message));
        if (msg.channel.type === discord_js_1.Constants.ChannelTypes[1])
            await msg.react('✅').catch(err => msg.channel.send(err.message));
        const safe = msg.channel instanceof discord_js_1.TextChannel ? !msg.channel.nsfw : true;
        const results = await image(search, safe);
        if (results.length <= 0)
            return 'No he encontrado resultados';
        if (!results[0])
            return 'No he encontrado resultados';
        const row = new discord_js_1.MessageActionRow()
            .addComponents([
            new discord_js_1.MessageButton()
                .setCustomId('Back')
                .setLabel('⬅')
                .setStyle('PRIMARY')
                .setDisabled(true),
            new discord_js_1.MessageButton()
                .setCustomId('Next')
                .setLabel('➡')
                .setStyle('PRIMARY')
                .setDisabled(false),
            new discord_js_1.MessageButton()
                .setCustomId('ExactMatch')
                .setLabel('🔢')
                .setStyle('PRIMARY')
        ]);
        const baseEmbed = new discord_js_1.MessageEmbed()
            .setDescription(`[${results[0].title}](${results[0].url})`)
            .setColor('RANDOM')
            .setImage(results[0].image)
            .addField('Safe search:', safe ? 'on' : 'off')
            .setFooter(`Results for ${search}`);
        if (safe)
            baseEmbed.setAuthor(msg.author.username, msg.author.displayAvatarURL());
        let query = 0;
        const querySize = results.length - 1;
        const message = await msg.channel.send({ embeds: [baseEmbed], components: [row] });
        const filter = (i) => (i.customId === 'Back' || i.customId === 'Next' || i.customId === 'ExactMatch') && i.user.id === msg.author.id;
        const collector = message.channel.createMessageComponentCollector({ filter, time: 120000 });
        collector.on('collect', async (i) => {
            var _a, _b, _c, _d;
            const embed = Object.assign(baseEmbed);
            if (i.customId === 'Back' && message.id === i.message.id) {
                query--;
                const response = results[query];
                if (response) {
                    (_a = row.components[0]) === null || _a === void 0 ? void 0 : _a.setDisabled(query <= 0 ? true : false);
                    (_b = row.components[1]) === null || _b === void 0 ? void 0 : _b.setDisabled(query >= querySize ? true : false);
                    embed.setImage(response.image);
                    embed.setFooter(`Page: ${query}/${querySize}`);
                    if (!safe)
                        embed.setDescription(`[${response.title}](${response.url})`);
                    await i.update({ embeds: [embed], components: [row] });
                }
            }
            else if (i.customId === 'Next' && message.id === i.message.id) {
                query++;
                const response = results[query];
                if (response) {
                    (_c = row.components[0]) === null || _c === void 0 ? void 0 : _c.setDisabled(query <= 0 ? true : false);
                    (_d = row.components[1]) === null || _d === void 0 ? void 0 : _d.setDisabled(query >= querySize ? true : false);
                    embed.setImage(response.image);
                    embed.setFooter(`Page: ${query}/${querySize}`);
                    if (!safe)
                        embed.setDescription(`[${response.title}](${response.url})`);
                    await i.update({ embeds: [embed], components: [row] });
                }
            }
            else if (i.customId === 'ExactMatch' && message.id === i.message.id) {
                await msg.reply(`Please send a number beetween 0 and ${querySize}`);
                const messageFilter = (m) => !isNaN(parseInt(m.content)) && m.author === msg.author;
                const messageCollector = msg.channel.createMessageCollector({ filter: messageFilter, time: 30 * 1000 });
                messageCollector.on('collect', async (m) => {
                    var _a, _b;
                    query = parseInt(m.content);
                    const response = results[query];
                    if (response) {
                        (_a = row.components[0]) === null || _a === void 0 ? void 0 : _a.setDisabled(query <= 0 ? true : false);
                        (_b = row.components[1]) === null || _b === void 0 ? void 0 : _b.setDisabled(query >= querySize ? true : false);
                        embed.setImage(response.image);
                        embed.setFooter(`Page: ${query}/${querySize}`);
                        if (!safe)
                            embed.setDescription(`[${response.title}](${response.url})`);
                        await message.edit({ embeds: [embed], components: [row] });
                    }
                });
                messageCollector.on('end', async (collected) => {
                    if (msg.channel instanceof discord_js_1.TextChannel) {
                        await msg.channel.send('Ok...');
                        await msg.channel.bulkDelete(collected);
                    }
                });
                await i.update({ embeds: [embed], components: [row] });
            }
        });
    }
};
async function image(query, moderate) {
    const results = await (0, duckduckgo_images_api_1.image_search)({ query, moderate });
    return [...results.filter(f => f)];
}
module.exports = command;
