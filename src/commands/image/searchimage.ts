import { MessageEmbed } from 'discord.js';
import gis from 'g-i-s';
import type { ICommand } from '../../types/command.d';
import type { Message, MessageReaction, User } from 'discord.js';

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
	    },
    },
    // @ts-ignore
	execute: (session) => async (msg, args) => {
		const search = args.join(' '),
			// emojis
			BACK = '⬅️',
			NEXT = '➡️',
			DELT = '🗑️'

		// the current page
		var page = 0;

		if (!search) {
			return 'Por favor especifica una búsqueda.';
		}

		gis(search, async (error: Error, results: File[]) => {
			if (error) msg.channel.send(error.message, { code: 'js' });
			if (msg.guild?.me?.permissions.has('ADD_REACTIONS')) {
				await msg.react('✅');
				if (!results[0]) return;
				// message
				const embed = new MessageEmbed();
				embed.setColor('RANDOM');
				embed.setAuthor(msg.author.username, msg.author.displayAvatarURL());
				embed.setImage(results[0].url);
				embed.setFooter('Page 1/50');
				const sended = await msg.channel.send(embed);
				await sended.react(BACK);
				await sended.react(NEXT);
				await sended.react(DELT);
				await awaitR(sended, sended.author)
			}

			async function awaitR(m: Message, author: User) {

				// remove reactions
				const removeR = (m: Message) => m.reactions.cache.filter((r) => r.users.cache.has(author.id));

				// filter
				const filter = (reaction: MessageReaction, user: User) =>
					[BACK, NEXT, DELT].includes(reaction.emoji.name)
					&& user.id === msg.author.id
					&& user.id !== session?.user?.id;

				// update the embed
				const update = function(m: Message, page: number) {
					const newEmbed = Object.create(m.embeds[0]!);
					newEmbed.setImage(results?.[page]?.url);
					newEmbed.setFooter(`Page: ${page + 1}/${results.length}`);
					return m.edit(newEmbed);
				};

				// Collection<string, MessageReaction>
				const collected = await m.awaitReactions(filter, { max: 1, time: 60 * 1000, errors: ['time']});
				switch (collected.first()?.emoji.name) {
					case BACK:
						if (page !== 0) {
							page--;
						}
						update(m, page);
						removeR(m);
						await awaitR(m, author);
					break;

					case NEXT:
						if (page !== 50) {
							page++;
						}
						update(m, page);
						removeR(m);
						await awaitR(m, author);
					break;

					case DELT:
						m.delete();
					break;

					default:
						await awaitR(m, author)
					break;
				}
			};
		});
	}
};
export = command;