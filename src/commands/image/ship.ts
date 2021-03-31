import type { ICommand } from '../../types/command';
import type { Image } from 'canvas';
import { default as Canvas } from  'canvas';
import { MessageEmbed, MessageAttachment } from 'discord.js';
const command: ICommand = {
    label: 'ship',
    alias: ['love'],
    options: {
        guildOnly: false,
        adminOnly: false
    },
    information: {
        descr: 'Te shipea con un usuario o shipea dos usuarios.',
        short: 'Ship a 2 usuarios.',
        usage: ''
    },
    execute: () => async (msg) => {

        var user1 = msg.mentions.users.first()!;
        var user2 = msg.mentions.users.last()!;

        if (!user1 && !user2) return 'Mencione a un usuario.';
        else if (user1 === user2) user1 = msg.author;

        const avatar1: Image = await Canvas.loadImage(
            user1.displayAvatarURL(
                {
                    format: 'png',
                    dynamic: false
                }
            )
        );
        const avatar2: Image = await Canvas.loadImage(
            user2.displayAvatarURL(
                {
                    format: 'png',
                    dynamic: false
                }
            )
        );
        const heartIm: Image = await Canvas.loadImage(
            'https://media.discordapp.net/attachments/744038841916194897/757760642072707152/corazon.png?width=475&height=475'
        );
        const shipname = [
            ...user1.username
            .slice(
                0,
                Math.floor(
                    user1.username.length / 2
                )
            ),
            ...user2.username
            .slice(
                Math.floor(
                    user1.username.length / 2
                ),
                user2.username.length
            )
        ].join('');

        const randnum = Math.round(Math.random() * 20);
        const bar = new Array<string>(20); // 20 length

        for (var i = randnum - 1; i >= 0; i--) {
            bar.push('█');
        }
        for (var i = 20 - randnum - 1; i >= 0; i--) {
            bar.push(' .');
        }

        const canvas = Canvas.createCanvas(800, 300);
        const ctx = canvas.getContext('2d');

        // canvas
        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        ctx.arc(800 - 125, 125, 100, 0, Math.PI * 2, true);
        ctx.arc(400, 125, 100, 0, Math.PI * 2, true);

        ctx.closePath();
        ctx.clip();

        ctx.drawImage(avatar1, 25, 25, 200, 200);
        ctx.drawImage(avatar2, 800 - 25 - 200, 25, 200, 200);
        ctx.drawImage(heartIm, 325, 50, 125, 125);

        const attachment = new MessageAttachment(canvas.toBuffer(), 'avatar.png');
        return new MessageEmbed()
            .setAuthor(msg.member?.displayName, msg.author.displayAvatarURL())
            .attachFiles([ attachment ])
            .setColor('RANDOM')
            .setDescription([reply(randnum), `Nombre del ship: **${shipname}**`, `El porcentaje de amor con ésta persona es **${randnum * 5}%**`, bar.join('')])
            .setImage('attachment://avatar.png');
    }
};
export = command;
function reply(randnum: number): string {

    switch (randnum) {
        case 0:
        case 1:
            return 'Son perfectamente compatibles como para una relación tóxica'
            break;
        case 2:
        case 3:
            return 'No son nada compatibles, diría que son enemigos jurados'
            break;
        case 4:
        case 5:
            return 'Ehm, no lo creo...'
            break;
        case 6:
        case 7:
            return 'Puede ser, pero no le veo futuro'
            break;
        case 8:
        case 9:
            return 'Puede ser, aunque mejor quédense como amigos'
            break;
        case 10:
        case 11:
            return 'Van por buen camino'
            break;
        case 12:
        case 13:
            return 'Si lo hablan bien, es muy posible que lleguen a algo'
            break;
        case 14:
        case 15:
            return 'Veo futuro en ustedes dos'
            break;
        case 16:
        case 17:
            return 'Seguro llegan a algo, se siente el amor a leguas'
            break;
        case 18:
        case 19:
            return 'Creo que realmente puede funcionar algo entre ustedes dos'
            break;    
        case 20:
            return '¿Son novios? a ver cojan'
            break;
        default:
            return '¿?'
            break;
    }
}