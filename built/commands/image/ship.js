"use strict";
const tslib_1 = require("tslib");
const canvas_1 = (0, tslib_1.__importDefault)(require("canvas"));
const discord_js_1 = require("discord.js");
const command = {
    label: 'ship',
    alias: ['love'],
    options: {
        guildOnly: false,
        adminOnly: false,
        information: {
            descr: 'Te shipea con un usuario o shipea dos usuarios.',
            short: 'Ship a 2 usuarios.',
            usage: ''
        }
    },
    execute: () => async (msg) => {
        let user1 = msg.mentions.users.first();
        const user2 = msg.mentions.users.last();
        if (!user1 && !user2)
            return 'Mencione a un usuario.';
        else if (user1 === user2)
            user1 = msg.author;
        const avatar1 = await canvas_1.default.loadImage(user1.displayAvatarURL({
            format: 'png',
            dynamic: false
        }));
        const avatar2 = await canvas_1.default.loadImage(user2.displayAvatarURL({
            format: 'png',
            dynamic: false
        }));
        const heartIm = await canvas_1.default.loadImage('https://media.discordapp.net/attachments/744038841916194897/757760642072707152/corazon.png?width=475&height=475');
        const shipname = [
            ...user1.username
                .slice(0, Math.floor(user1.username.length / 2)),
            ...user2.username
                .slice(Math.floor(user1.username.length / 2), user2.username.length)
        ].join('');
        const randnum = Math.round(Math.random() * 20);
        const bar = new Array(20);
        for (let i = randnum - 1; i >= 0; i--)
            bar.push('█');
        for (let i = 20 - randnum - 1; i >= 0; i--)
            bar.push(' .');
        const canvas = canvas_1.default.createCanvas(800, 300);
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        ctx.arc(800 - 125, 125, 100, 0, Math.PI * 2, true);
        ctx.arc(400, 125, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar1, 25, 25, 200, 200);
        ctx.drawImage(avatar2, 800 - 25 - 200, 25, 200, 200);
        ctx.drawImage(heartIm, 325, 50, 125, 125);
        const attachment = new discord_js_1.MessageAttachment(canvas.toBuffer(), 'avatar.png');
        const embed = new discord_js_1.MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL())
            .setColor('RANDOM')
            .setDescription(`
			${reply(randnum)}
			Nombre del ship: **${shipname}**
			El porcentaje de amor con ésta persona es **${randnum * 5}%**
			${bar.join('')}
			`)
            .setImage('attachment://avatar.png');
        return { embeds: [embed], files: [attachment] };
    }
};
function reply(randnum) {
    switch (randnum) {
        case 0:
        case 1:
            return 'Son perfectamente compatibles como para una relación tóxica';
            break;
        case 2:
        case 3:
            return 'No son nada compatibles, diría que son enemigos jurados';
            break;
        case 4:
        case 5:
            return 'Ehm, no lo creo...';
            break;
        case 6:
        case 7:
            return 'Puede ser, pero no le veo futuro';
            break;
        case 8:
        case 9:
            return 'Puede ser, aunque mejor quédense como amigos';
            break;
        case 10:
        case 11:
            return 'Van por buen camino';
            break;
        case 12:
        case 13:
            return 'Si lo hablan bien, es muy posible que lleguen a algo';
            break;
        case 14:
        case 15:
            return 'Veo futuro en ustedes dos';
            break;
        case 16:
        case 17:
            return 'Seguro llegan a algo, se siente el amor a leguas';
            break;
        case 18:
        case 19:
            return 'Creo que realmente puede funcionar algo entre ustedes dos';
            break;
        case 20:
            return '¿Son novios? a ver cojan';
            break;
        default:
            return '¿?';
            break;
    }
}
module.exports = command;
