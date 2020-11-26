import { MessageEmbed } from 'discord.js';
import { ICommand } from '../../types/command';
import { default as translate } from '@vitalets/google-translate-api';

export const command: ICommand = {
    label: 'translate',
    alias: ['tr', 'traducir'],
    options: {
        guildOnly: false,
        adminOnly: false,
    },
    execute: () => async (msg, args) => {
        const lang = args[0],
              text = args.slice(1).join(' ');

        if (!lang)
            return 'Necesitas colocar a que idioma vas a traducir el texto.\n\
            Aquí los lenguajes disponibles: https://www.science.co.il/language/Locale-codes.php';

        if (!text)
            return 'No especificaste un texto válido.';

        const translated = await translate(text, { from: 'auto', to: lang })
                                    .catch((err: Error) => console.error(err));

        return new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(msg.author.username, msg.author.displayAvatarURL())
            .setTimestamp()
            .setTitle('💬 Traducción')
            .setDescription(`${translated.text}`)
            .setFooter(`Lenguaje al que se tradució: ${lang}`);
    }
};
