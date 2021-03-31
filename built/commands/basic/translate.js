"use strict";
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const google_translate_api_1 = tslib_1.__importDefault(require("@vitalets/google-translate-api"));
const command = {
    label: 'translate',
    alias: ['tr', 'traducir'],
    options: {
        guildOnly: false,
        adminOnly: false,
    },
    information: {
        descr: 'Traduce al idioma especificado\nAquí los lenguajes disponibles: https://www.science.co.il/language/Locale-codes.php',
        short: 'Traducir lenguajes.',
        usage: '<$Lenguaje> <$Texto>'
    },
    execute: () => (msg, args) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const lang = args[0], text = args.slice(1).join(' ');
        if (!lang)
            return 'Necesitas especificar a qué idioma vas a traducir el texto, usa **help translate** para poder ayudarte.';
        if (!text)
            return 'No especificaste un texto válido.';
        const translated = yield google_translate_api_1.default(text, { from: 'auto', to: lang })
            .catch((err) => console.error(err));
        return new discord_js_1.MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(msg.author.username, msg.author.displayAvatarURL())
            .setTimestamp()
            .setTitle(String.raw `\💬 Traducción`)
            .setDescription(translated.text)
            .setFooter(`Lenguaje al que se tradució: ${lang}`);
    })
};
module.exports = command;
