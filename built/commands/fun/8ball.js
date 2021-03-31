"use strict";
const discord_js_1 = require("discord.js");
const rpts = ['Sí', 'No', 'Tal vez', 'No sé', '¡Claro!', 'Podría ser', 'Es poco probable', 'Quizás'];
const command = {
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
        if (question[question.length - 1] !== '?')
            return 'Tu pregunta debe terminar con `?`';
        return new discord_js_1.MessageEmbed()
            .setColor('RANDOM')
            .addField(String.raw `\🎱 8ball`, '\u200b')
            .setThumbnail(msg.author.displayAvatarURL())
            .addField('Tu pregunta fue:', question)
            .addField('Mi respuesta es:', rpts[Math.floor(Math.random() * rpts.length)]);
    }
};
module.exports = command;
