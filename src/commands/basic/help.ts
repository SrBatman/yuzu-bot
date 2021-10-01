import type { ICommand } from '../../typing/command.d';
import { MessageEmbed } from 'discord.js';
import { commandFiles as commands } from '../../bot';
import options from '../../options';
const command: ICommand = {
	label: 'help',
	alias: ['h'],
	options: {
		guildOnly: false,
		adminOnly: false,
		information: {
			descr: 'Busca información acerca de un comando - muestra todos los comandos.',
			short: 'Busca comandos.',
			usage: '[$Comando]'
		}
	},
	cooldown: 5,
	execute: (session) => (msg, args) => {
		const search = args.join(' ');
		const base = new MessageEmbed()
			.setColor('RANDOM')
			.setThumbnail(msg.author.displayAvatarURL())
			.setTimestamp()
			.setAuthor(msg.author.username, msg.author.displayAvatarURL())
			.setDescription(`El prefix del bot es ${options.prefix}`);
		if (!search) {
			const info = [ ...commands.values() ]
				.map(c => [
					`- \`${`[${c.label}] ${c?.alias ? c.alias.join(', ') : ''}`.trim() ?? c.label}\``,
					` ${c?.options?.information?.short ?? c.options?.information?.descr ?? 'Comando sin descripción'}`
				]
				);
			return Object.assign(base)
				.setTitle(String.raw`\👾 Comandos de ${session.user?.tag}`)
				.setColor('RANDOM')
				.setDescription([ base.description ?? 'sin descripción...', ...info ].join('\n'));
		}
		const cmd = commands.get(search) as ICommand;

		if (!cmd)
			return 'No encontré ese comando.';

		return Object.assign(base)
			.setTitle('Información del comando.')
			.addFields([
				{
					name: 'Nombre del comando',
					value: cmd.label ?? '???'
				},
				{
					name: 'Alias',
					value: !cmd.alias ? 'sin alias' : cmd.alias.length > 0 ? cmd.alias.join(' ') : 'sin alias'
				},
				{
					name: 'Información y uso del comando',
					value: [
						cmd.options?.information?.descr ?? cmd.options?.information?.short ?? 'Comando sin descripción',
						cmd.options?.information?.usage ?? 'Comando sin información.'
					].join('\n')
				},
				{
					name: 'Cooldown',
					value: `${cmd.cooldown ?? 3}`
				}
			]);
	}
};
export = command;