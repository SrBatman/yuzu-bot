import type { ICommand } from '../../types/command';
import { MessageEmbed } from 'discord.js';

const rpts = ['Sí', 'No', 'Tal vez', 'No sé', '¡Claro!', 'Podría ser', 'Es poco probable', 'Quizás'];

export const command: ICommand = {
    label: '8ball',
    alias: [`${rpts.length}ball`],
    options: {
        guildOnly: false,
        adminOnly: false
    },
    execute: () => (msg, args) => {
            const question = args.join(' ');

            if (!question)
                return 'Por favor preguntame algo.';

            if (question[question.length -1] !== '?')
                return 'Tu pregunta debe terminar con `?`';

            return new MessageEmbed()
                .setColor('RANDOM')
                .addField(String.raw`\🎱 8ball`, '\u200b')
                .setThumbnail(msg.author.displayAvatarURL())
                .addField('Tu pregunta fue:', question)
                .addField('Mi respuesta es:', rpts[Math.floor(Math.random() * rpts.length)]);
    }
}