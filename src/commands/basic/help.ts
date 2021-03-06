import type { ICommand } from '../../typing/command.d';
import { MessageEmbed } from 'discord.js';
import { commands } from '../../bot';
import Options from '../../options';
const command: ICommand = {
	label: 'help',
	alias: ['h'],
	options: {
		guildOnly: false,
		adminOnly: false,
		information: {
			descr: 'Busca informaci贸n acerca de un comando - muestra todos los comandos.',
			short: 'Busca comandos.',
			usage: '[Comando]'
		}
	},
	cooldown: 5,
	execute: session => (msg, args) => {
		const search = args.join(' ');
		const base = new MessageEmbed()
			.setColor('RANDOM')
			.setThumbnail(msg.author.displayAvatarURL())
			.setTimestamp()
			.setAuthor(msg.author.username, msg.author.displayAvatarURL())
			.setDescription(`El prefix del bot es ${Options.Prefix}`);
		if (!search) {
			const info = [ ...commands.values() ]
				.map(c => [
					`- \`${`[${c.label}] ${c?.alias ? c.alias.join(', ') : ''}`.trim() ?? c.label}\``,
					` ${c?.options?.information?.short ?? c.options?.information?.descr ?? 'Comando sin descripci贸n'}`
				]);

			const commandEmbed = <MessageEmbed> Object.assign(base)
				.setTitle(String.raw`\馃懢 Comandos de ${session.user?.tag}`)
				.setColor('RANDOM')
				.setDescription([ base.description ?? 'sin descripci贸n...', ...info ].join('\n'));
			return commandEmbed;
		}
		const cmd = <ICommand> commands.get(search);

		if (!cmd)
			return 'No encontr茅 ese comando';

		return <MessageEmbed> Object.assign(base)
			.setTitle('Informaci贸n del comando.')
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
					name: 'Informaci贸n y uso del comando',
					value: [
						cmd.options?.information?.descr ?? cmd.options?.information?.short ?? 'Comando sin descripci贸n',
						cmd.options?.information?.usage ?? 'Comando sin informaci贸n.'
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