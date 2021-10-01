import type { ICommand } from '../../typing/command.d';
import { MessageEmbed } from 'discord.js';
const command: ICommand = {
	label: 'serverinfo',
	alias: ['sv', 'server'],
	options: {
		guildOnly: true,
		adminOnly: false,
		information: {
			descr: 'Busca información acerca del servidor.',
			short: 'Ver el servidor.',
			usage: ''
		}
	},
	execute: () => (msg) => {
		const channels: { readonly [ k: string ]: number | undefined } = {
			'text': msg.guild?.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').size,
			'voice': msg.guild?.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').size
		};
		const bots = msg.guild?.members.cache.filter(member => member.user.bot).size as number;
		const members = msg.guild?.members.cache.filter(member => !member.user.bot).size as number;

		return new MessageEmbed()
			.setAuthor(msg.guild?.name ?? 'No reconocido', msg.guild?.iconURL() ?? msg.author.displayAvatarURL())
			.setColor('RANDOM')
			.setThumbnail(msg.guild?.iconURL() ?? msg.author.displayAvatarURL())
			.setTimestamp()
			.setFooter(`ID: ${msg.guild?.id}`)
			.addFields([
				{
					name: 'Roles',
					value: `${msg.guild?.roles.cache.filter(x => !x.managed)
						.filter(x => x.name  !== '@everyone')
						.map(x => x.toString())
						.slice(0, 15)
						.join(' ')}...`,
					inline: true
				},
				{
					name: 'Creada',
					value: <string> msg.guild?.createdAt.toLocaleString('es'),
					inline: true
				},
				{
					name: 'Bots',
					value: bots.toString(),
					inline: true
				},
				{
					name: 'Members',
					value: members.toString(),
					inline: true
				},
				{
					name: 'Canales',
					value: `**Text**: ${channels.text}\n**Voice**: ${channels.voice}`,
					inline: true
				}
			]);
	}
};
export = command;