import type { ICommand } from '../../typing/command.d';
import { MessageEmbed } from 'discord.js';
import { transpile } from 'typescript';
import { inspect } from 'util';
const command: ICommand = {
    label: 'eval',
    options: {
        guildOnly: true,
        adminOnly: false,
    },
    execute: (session) => async (msg, args) => {
    	if (msg.author.id !== '790411185970872320') //TODO
    		return 'Qué hacés down solo Le Val puede usar eso';
        try {

            if (msg.author.id !== '790411185970872320')
                throw new Error('Qué hacés down solo Le Val puede usar eso.');
        }
        catch (err: unknown) {

            if (err instanceof (String || Error || TypeError || RangeError || EvalError))
                msg.channel.send({ content: 'Error '+err });
        }
        finally {
            const entry = args?.join(' ');
            const exit = inspect(eval(transpile(entry)));

            if (exit)
                return new MessageEmbed()
                    .setAuthor(msg.member?.nickname ?? msg.author.username, msg.author.displayAvatarURL())
                    .setColor('RANDOM')
                    .setTitle('Eval')
                    .addField(`Evaluado en:`, `\`\`\`ts\n${session.ws.ping}ms\`\`\``, true)
                    .addField('Entrada :inbox_tray:', `\`\`\`ts\n${entry}\`\`\``, true)
                    .addField('Salida :outbox_tray:', `\`\`\`ts\n${exit}\`\`\``, true)
                    .addField('Tipo :bar_chart:', `\`\`\`ts\n${typeof exit}\`\`\``, true);
            else
                return 'Escribe algo.';
        }
    }
};
export = command;