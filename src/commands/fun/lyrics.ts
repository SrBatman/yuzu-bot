import type { ICommand } from '../../typing/command.d';
import { MessageEmbed, Util } from 'discord.js';
import superagent from 'superagent';
const command: ICommand = {
	label: 'lyrics',
	alias: ['song', 's'],
	options: {
		guildOnly: false,
		adminOnly: false,
		information: {
			descr: 'Busca la letra e información de una canción.',
			short: 'Busca letras de canciones.',
			usage: '<$Letra>'
		}
	},
	execute: () => async (msg, args) => {

		const search = args?.join(' ');

		if (!search)
			return 'Argumento invalido, escribe algo.';

		const song = await requestSong(search);

		if (!song)
			return 'No pude encontrar esa canción master.';

		const embed = new MessageEmbed()
			.setTitle(song.title)
			.setAuthor(song.author, song.icon)
			.setColor('RANDOM');

		if (song.lyrics.length > 2048) {
			for (const line of Util.splitMessage(song.lyrics)) {
				embed.setFooter(line);
				msg.channel.send({ embeds: [ embed ] });
			}
			return;
		}
		else embed.setFooter(song.lyrics);
		return embed;
	}
};
type Song = {
	lyrics: string,
	author: string,
	icon: string,
	title: string
};
async function requestSong(search: string): Promise<Song> {
	const { body } = await superagent.get(`https://some-random-api.ml/lyrics/?title=${search}`);
	const song: Song = {
		lyrics: body.lyrics,
		author: body.author,
		title: body.title,
		icon: body.thumbnail.genius
	};
	return song;
}
export = command;