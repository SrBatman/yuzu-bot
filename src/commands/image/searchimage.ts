import type { ICommand, MessageContent } from '../../typing/command.d';
import type { MessageComponentInteraction } from 'discord.js';
import { MessageEmbed, MessageActionRow, MessageButton, Message } from 'discord.js';
import { default as google } from 'g-i-s';
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
			usage: '<Search>'
		}
	},
	execute: () => async (msg, args): Promise<MessageContent> => {

		const search = args.join(' ');
		if (!search)
			return 'Por favor especifica una búsqueda';

		const results = await image(search);
		if (!results[1])
			return 'No he encontrado resultados';

		const row = new MessageActionRow()
			.addComponents([
				new MessageButton()
					.setCustomId('Back')
					.setLabel('⏪')
					.setStyle('PRIMARY')
					.setDisabled(true),
				new MessageButton()
					.setCustomId('Next')
					.setLabel('⏩')
					.setStyle('PRIMARY')
					.setDisabled(false),
				new MessageButton()
					.setCustomId('ExactMatch')
					.setLabel('🔢')
					.setStyle('PRIMARY')
			]);
		const baseEmbed = new MessageEmbed()
			.setColor('RANDOM')
			.setAuthor(msg.author.username, msg.author.displayAvatarURL())
			.setImage(results[1].url)
			.setFooter('Page: 1 (first)');

		let query = 1;
		const message = await msg.channel.send({ embeds: [ baseEmbed ], components: [ row ] });

		// collector
		const filter = (i: MessageComponentInteraction) => (i.customId === 'Back' || i.customId === 'Next' || i.customId === 'ExactMatch') && i.user.id === msg.author.id;
		const collector = message.channel.createMessageComponentCollector({ filter, time: 60 * 1000 });

		collector.on('collect', async i => {
			const embed = <MessageEmbed> Object.assign(baseEmbed);
			if (i.customId === 'Back' && message.id === i.message.id) {
				query--;
				const newRow = new MessageActionRow()
					.addComponents([
						new MessageButton()
							.setCustomId('Back')
							.setLabel('⏪')
							.setStyle('PRIMARY')
							.setDisabled(query < 1 ? true : false),
						new MessageButton()
							.setCustomId('Next')
							.setLabel('⏩')
							.setStyle('PRIMARY')
							.setDisabled(query > results.length ? true : false),
						new MessageButton()
							.setCustomId('ExactMatch')
							.setLabel('🔢')
							.setStyle('PRIMARY')
						]);
				if (results[query] && results[1])
					await i.update({ embeds: [ embed.setImage(results[query]?.url ?? results[1].url).setFooter(`Page: ${query}/${results.length}`) ], components: [ newRow ] });
			}
			else if (i.customId === 'Next' && message.id === i.message.id) {
				query++;
				const newRow = new MessageActionRow()
					.addComponents([
						new MessageButton()
							.setCustomId('Back')
							.setLabel('⏪')
							.setStyle('PRIMARY')
							.setDisabled(query < 1 ? true : false),
						new MessageButton()
							.setCustomId('Next')
							.setLabel('⏩')
							.setStyle('PRIMARY')
							.setDisabled(query > results.length ? true : false),
						new MessageButton()
							.setCustomId('ExactMatch')
							.setLabel('🔢')
							.setStyle('PRIMARY')
					]);
				if (results[query] && results[1])
					await i.update({ embeds: [ embed.setImage(results[query]?.url ?? results[1].url).setFooter(`Page: ${query}/${results.length}`) ], components: [ newRow ] });
			}
			else if (i.customId === 'ExactMatch' && message.id === i.message.id) {
				const m = await msg.reply(`Please send a number beetween 0 and ${results.length}`);
				const newRow = new MessageActionRow()
					.addComponents([
						new MessageButton()
							.setCustomId('Back')
							.setLabel('⏪')
							.setStyle('PRIMARY')
							.setDisabled(query < 1 ? true : false),
						new MessageButton()
							.setCustomId('Next')
							.setLabel('⏩')
							.setStyle('PRIMARY')
							.setDisabled(query > results.length ? true : false),
						new MessageButton()
							.setCustomId('ExactMatch')
							.setLabel('🔢')
							.setStyle('PRIMARY')
					]);
				const filter = (m: Message) => !isNaN(parseInt(m.content)) && m.author === msg.author;
				const messageCollector = m.channel.createMessageCollector({ filter, time: 15 * 1000 });
				messageCollector.on('collect', async m => {
					const selection = parseInt(m.content);
					query = selection;

					const response = results[query];
					if (!response) {
						msg.channel.send({ content: 'No se encontró la página' });
						return;
					}
					embed.setImage(response.url);
					embed.setFooter(`Page: ${query}/${results.length}`);
					await message.edit({ embeds: [ embed ], components: [ newRow ] });
					return;
				});
				await i.update({ embeds: [ embed ], components: [ newRow ] })
			}
		});
	}
};
function image(search: string): Promise<File[]> {
	return new Promise((resolve, reject) => {
		google(search, (error: Error, results: File[]) => {
			if (error) {
				reject(error);
				return;
			}
			if (results) resolve([ ...results.filter(f => f) ]);
		});
	});
}
export = command;