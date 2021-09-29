import type { ICommand } from '../../typing/command.d';
import { MessageEmbed } from 'discord.js';
import { commands } from '../../bot';
import { options } from '../../options';

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
    cooldown: 5,
    execute: (session) => async (msg, args) => {
        const search = args.join(' ');
        const base = new MessageEmbed()
            .setColor('RANDOM')
            .setThumbnail(msg.author.displayAvatarURL())
            .setTimestamp()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL())
            .setDescription(`El prefix del bot es ${options.prefix}`);
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
                .setDescription([ base.description!, ...info ].join('\n'));
        }
        const command = commands.get(search) as ICommand;

        if (!command)
            return 'No encontré ese comando.';

        return Object.assign(base)
            .setTitle('Información del comando.')
            .addFields([
                {
                    name: 'Nombre del comando',
                    value: command.label ?? '???'
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
                    ].join('\n')
                },
                {
                    name: 'Cooldown',
                    value: `${command.cooldown ?? 3}`
                }
            ]);
    }
};
export = command;