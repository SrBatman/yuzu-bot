import { MessageEmbed } from 'discord.js';
import type { ICommand } from '../../types/command';
export const command: ICommand = {
    label: '8ball',
    options: {
        guildOnly: false,
        adminOnly: false
    },
    execute: () => (msg, args) => {
            const rpts = ["Sí", "No", "Tal vez", "No sé", "¡Claro!", "Podría ser", "Es poco probable", 'Quizás'],
                  question = args.join(' ');

            if (!question)
                return 'Por favor pregúntame algo.';
            
            return new MessageEmbed()
                .setTitle(':8ball: -> 8Ball')
                .setThumbnail(msg.author.displayAvatarURL())
                .addField('Tu pregunta fue:', question, true)
                .addField('Mi respuesta es:', rpts[Math.floor(Math.random() * rpts.length - 1)], true);
    }
}