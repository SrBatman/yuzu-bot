import type { ICommand } from '../../typing/command.d';
import { Permissions } from 'discord.js';
const command: ICommand = {
	label: 'say',
	alias: ['esay', 'shadowsay'],
	options: {
		guildOnly: false,
		adminOnly: false,
		information: {
			descr: 'Hace que el bot diga algo muy malo',
			short: 'Escribir el siguiente mensaje del bot.',
			usage: '<Texto>'
		}
	},
	execute: () => (msg, args) => {
		const text = args.join(' ');

		if (msg.guild?.me?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))
			msg.delete();

		if (!text)
			return 'Escribí el contenido del mensaje o te revoleo a piñas';

		if (text.split(' ').some(l => l === '@everyone' || l === '@here'))
			return 'noup';

		return text;
	}
};
export = command;