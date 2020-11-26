import type { ICommand } from '../../types/command';
import { MessageEmbed } from 'discord.js';
export const command: ICommand = {
    label: 'calcular',
    options: {
        guildOnly: false,
        adminOnly: false,
    },
    execute: () => (msg, args) => {
        let math = require('maths.ts');
        let result;
        try{
          result = math.evaluate(args.join(' '))
        } catch(err) {
          result = 'Entrada Invalida'
        }
        const a = new MessageEmbed()
        .addField('Entrada:', '```js\n'+args.join(' ')+'```', false)
        .addField('Salida:', '```js\n'+result+'```', false)
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL({dynamic: true}))
        .setColor('RANDOM')
        .setThumbnail('https://images.vexels.com/media/users/3/129697/isolated/preview/2cf64de279ce43f6c0b27d81656f2fbb-calculadora-c--rculo-icono-3-by-vexels.png')
        if (args.join(' ')) {
            return msg.channel.send(a);
          } else {
            return msg.channel.send(`**${msg.author.username}**, Necesitas calcular algo...`);
          }
        
        }}
