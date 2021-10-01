import type { ICommand } from '../../typing/command.d';
import { MessageEmbed } from 'discord.js';
import gis from 'g-i-s';
type File = {
	width: number,
	height: number,
	url: string
}
const command: ICommand = {
	label: 'image',
	alias: ['img', 'im', 'i'],
	options: {
		guildOnly: false,
		adminOnly: false,
		information: {
			descr: 'Busca imágenes en Google.',
			short: 'Busca imágenes en Google.',
			usage: 'image <$Search>'
		}
	},
	execute: () => (msg, args) => {
		const search = args.join(' ');

		if (!search)
			return 'Por favor especifica una búsqueda.';

		gis(search, (error: Error, results: File[]) => {
			if (error) msg.channel.send({ content: error.message });
			if (results[0])
				return new MessageEmbed()
					.setColor('RANDOM')
					.setAuthor(msg.author.username, msg.author.displayAvatarURL())
					.setImage(results[0].url);
			else return undefined; //void
		});
		return undefined;
	}
};
export = command;