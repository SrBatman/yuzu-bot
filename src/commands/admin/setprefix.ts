import type { ICommand } from '../../typing/command.d';
import type { IPrefix } from '../../database/models/prefix.model';
import type { Guild } from 'discord.js';
import { Permissions } from 'discord.js';
import * as Controller from '../../database/controllers/prefix.controller';
import options from '../../options';
async function addPrefix(content: string, guild: Guild): Promise<IPrefix> {
	const output = await Controller.add({ prefix: content, server: guild.id });
	return output;
}
async function getPrefix(guild: Guild): Promise<IPrefix | null> {
	const output = await Controller.get(guild.id);
	return output;
}
async function editPrefix(prefix: string, guild: Guild): Promise<IPrefix | null> {
	const toUpdate = await getPrefix(guild);
	if (toUpdate) {
		const output = await Controller.edit(toUpdate, prefix, guild.id);
		return output;
	}
	return null;
}
const command: ICommand = {
	label: 'prefix',
	alias: ['setprefix'],
	options: {
		guildOnly: true,
		adminOnly: false,
		information: {
			descr: 'Establece u edita el prefijo del servidor.',
			short: 'Configurar prefijos.',
			usage: '[prefix]'
		}
	},
	execute: () => async (msg, args) => {
		if (args[1])
			return 'No soportamos prefijos multi-línea, ¡lo sentimos!';

		if (!msg.guild) return;
		const prefix = args[0];
		const customPrefix = await getPrefix(msg.guild);

		if (!prefix && customPrefix?.prefix)
			return `El prefix es **${customPrefix?.prefix}**`;

		if (!prefix) //todo
			return `El prefix no ha sido cambiado aún así que es **${options.prefix}**`;

		if (!msg.guild)
			return 'No encontré los datos del servidor, ¿Probaste en ejecutar el comando dentro de un servidor?';

		if (!msg.member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
			return 'No tenés permisos para hacer eso, down.';

		if (!customPrefix || !customPrefix.prefix || customPrefix.prefix === options.prefix) {
			const newPrefix = await addPrefix(prefix, msg.guild);
			return `El nuevo prefix será **${newPrefix.prefix}**`;
		}
		else {
			await editPrefix(prefix, msg.guild);
			return `Actualicé el prefix de **${customPrefix?.prefix}** a **${prefix}**`;
		}
	}
};
export = command;