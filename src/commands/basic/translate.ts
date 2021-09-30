import { MessageEmbed } from 'discord.js';
import { ICommand } from '../../typing/command.d';
import { default as translate } from '@vitalets/google-translate-api';

const command: ICommand = {
    label: 'translate',
    alias: ['tr', 'traducir'],
    options: {
        disabled: true,
        guildOnly: false,
        adminOnly: false,
        information: {
            descr: 'Traduce al idioma especificado\nAquí los lenguajes disponibles: https://www.science.co.il/language/Locale-codes.php',
            short: 'Traducir lenguajes.',
            usage: '<$Lenguaje> <$Texto>',
        },
    },
    execute: () => async (msg, args) => {
        const lang = args[0],
              text = args.slice(1).join(' ');

        if (!lang)
            return 'Necesitas especificar a qué idioma vas a traducir el texto, usa **help translate** para poder ayudarte.';

        if (!text)
            return 'No especificaste un texto válido.';

        const translated = <{ text: string }> await translate(text, { from: 'auto', to: lang })
            .catch((err: Error) => console.error(err));
        return new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(msg.author.username, msg.author.displayAvatarURL())
            .setTimestamp()
            .setTitle(String.raw`\💬 Traducción`)
            .setDescription(translated.text)
            .setFooter(`Lenguaje al que se tradució: ${lang}`);
    }
};
export = command;