import type { ICommand } from '../../typing/command.d';
import { MessageEmbed, Permissions } from 'discord.js';
const command: ICommand = {
	label: 'emotes',
	alias: [],
	options: {
		guildOnly: true,
		adminOnly: false,
		information: {
			descr: 'Muestra emotes del server, añade y remueve emotes',
			short: 'Muestra emotes del server',
			usage: '[set | del]'
		}
	},
	execute: () => async (msg, args) => {

		const arg = args[0];

		if (arg === 'set') {
			if (!msg.member?.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS))
				return 'No tienes permisos suficientes para hacer eso.';

			if (!msg.guild?.me?.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS))
				return 'No tengo permisos.';

			const [ , name, url ] = args;
			const roles = msg.mentions.roles;

			if (!name)
				return 'Debes especificar el nombre del emoji';

			if (!url)
				return 'Debes especificar la imagen del emoji';

			const emoji = await msg.guild?.emojis.create(url, name, { roles }).catch((err: Error) => console.error(err));
			return `Creé ${emoji?.name} para el server ${emoji?.guild.name} ${emoji?.toString()}`;
		}
		if (arg === 'del') {
			if (!msg.member?.permissions.has([Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS, Permissions.FLAGS.ADMINISTRATOR]))
				return 'No tienes permisos suficientes para hacer eso.';

			if (!msg.guild?.me?.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS))
				return 'No tengo permisos.';

			const [ , name ] = args;
			const emoji = await msg.guild?.emojis.cache.find(e => e.name === name);
			if (!emoji) return 'No se encontrò el emoji';
			const deleted = await emoji.delete().catch((err: Error) => console.error(err));
			return `Removì ${deleted?.name} para el server ${emoji?.guild.name}`;
		}
		return new MessageEmbed()
			.setColor('RANDOM')
			.setDescription(`Emotes: ${msg.guild?.emojis.cache.map(e => e.toString()).join(' ')}`);
	}
};
export = command;