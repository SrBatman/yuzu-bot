import type { ICommand } from '../../types/command';
import type { GuildStructure } from '../../structures/Guild';
import { MessageEmbed } from 'discord.js';
import { commands } from '../../bot';
import { options } from '../../options';
import '../../structures/Guild';
const command: ICommand = {
	label: 'help',
	alias: ['h'],
    options: {
        guildOnly: false,
        adminOnly: false,
        information: {
            descr: 'Busca información acerca de un comando - muestra todos los comandos.',
            short: 'Busca comandos.',
            usage: '[$Comando]',
        },
    },
    execute: (session) => async (msg, args) => {
        const search = args.join(' ');
        const base = new MessageEmbed()
            .setColor('RANDOM')
            .setThumbnail(msg.author.displayAvatarURL())
            .setTimestamp()
            .setAuthor(msg.guild ? msg.member?.displayName : msg.author.username, msg.author.displayAvatarURL())
            .setDescription([
                'Comando de ayuda para pelotudos',
                `El prefix del bot es ${!msg.guild ? options.prefix : (await (msg.guild as GuildStructure).getPrefix()).prefix}`
            ]);
        if (!search) {
            const info = [ ...commands.values() ]
                .map(cmd => [
                        `- \`${`[${cmd.label}] ${cmd?.alias ? cmd.alias.join(', ') : ''}`.trim() ?? cmd.label}\``,
                        ` ${cmd?.options?.information?.short ?? cmd.options?.information?.descr ?? 'Comando sin descripción'}`
                    ]
                );
            return Object.assign(base)
                .setTitle(String.raw`\👾 Comandos de ${session.user?.tag}`)
                .setColor('RANDOM')
                .setDescription([ base.description!, ...info ]);
        }
        const command = commands.get(search) as ICommand;

        if (!command)
            return 'No encontré ese comando.';

        return Object.assign(base)
            .setTitle('Información del comando.')
            .addFields([
                {
                    name: 'Nombre del comando',
                    value: command.label
                },
                {
                    name: 'Alias',
                    value: !command.alias ? 'sin alias' : command.alias.length > 0 ? command.alias.join(' ') : 'sin alias'
                },
                {
                    name: 'Información y uso del comando',
                    value: [
                        command.options?.information?.descr ?? command.options?.information?.short ?? 'Comando sin descripción',
                        command.options?.information?.usage ?? 'Comando sin información.'
                    ]
                },
                {
                    name: 'Cooldown',
                    value: command.cooldown ?? 3
                }
            ]);
    }
};
export = command;