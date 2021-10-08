import type { ICommand, MessageContent } from '../../typing/command.d';
import type { MessageComponentInteraction, Message } from 'discord.js';
import { MessageEmbed, MessageActionRow, MessageButton, Permissions, Constants, TextChannel } from 'discord.js';
import { image_search as imageSearch } from 'duckduckgo-images-api';

const command: ICommand = {
	cooldown: 4,
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
	execute: () => async (msg, args): Promise<MessageContent | undefined> => {

		async function image(query: string, moderate = true) {
			const results = await imageSearch({ query, moderate });
			return [ ...results.filter(f => f) ];
		}

		const search = args.join(' ');

		if (!search)
			return 'Por favor especifica una búsqueda';

		if (msg.guild?.me?.permissions.has(Permissions.FLAGS.ADD_REACTIONS))
			await msg.react('✅').catch(err => msg.channel.send(err.message));

		if (msg.channel.type === Constants.ChannelTypes[1])
			await msg.react('✅').catch(err => msg.channel.send(err.message));

		const safe = msg.channel instanceof TextChannel ? !msg.channel.nsfw : true;
		const results = await image(search, safe);

		if (results.length <= 0)
			return 'No he encontrado resultados';

		if (!results[0])
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
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('Delete')
					.setLabel('✖')
					.setStyle('DANGER')
			]);

		const baseEmbed = new MessageEmbed()
			.setColor('RANDOM')
			.setImage(results[0].image)
			.addField('Safe search:', safe ? 'on' : 'off')
			.setFooter(`Results for ${search}`)
			.setAuthor(msg.author.username, msg.author.displayAvatarURL());

		if (!safe) baseEmbed.setDescription(`[${results[0].title}](${results[0].url})`);

		let query = 0;
		const querySize = results.length - 1;
		const message = await msg.channel.send({ embeds: [ baseEmbed ], components: [ row ] });

		// collector
		const filter = (i: MessageComponentInteraction) => (i.customId === 'Back' || i.customId === 'Next' || i.customId === 'ExactMatch' || i.customId === 'Delete') && i.user.id === msg.author.id;
		const collector = message.channel.createMessageComponentCollector({ filter, time: 25 * 1000 });

		collector.on('collect', async i => {
			const embed = <MessageEmbed> Object.assign(baseEmbed);
			if (i.customId === 'Back' && message.id === i.message.id) {
				query--;
				const response = results[query];
				if (response) {
					row.components[0]?.setDisabled(query <= 0);
					row.components[1]?.setDisabled(query >= querySize);
					embed.setImage(response.image);
					embed.setFooter(`Page: ${query}/${querySize}`);
					if (!safe)
						embed.setDescription(`[${response.title}](${response.url})`);
					await i.update({ embeds: [ embed ], components: [ row ] });
					collector.resetTimer();
				}
			}
			else if (i.customId === 'Next' && message.id === i.message.id) {
				query++;
				const response = results[query];
				if (response) {
					row.components[0]?.setDisabled(query <= 0);
					row.components[1]?.setDisabled(query >= querySize);
					embed.setImage(response.image);
					embed.setFooter(`Page: ${query}/${querySize}`);
					if (!safe)
						embed.setDescription(`[${response.title}](${response.url})`);
					await i.update({ embeds: [ embed ], components: [ row ] });
					collector.resetTimer();
				}
			}
			else if (i.customId === 'ExactMatch' && message.id === i.message.id) {
				await msg.reply(`Please send a number beetween 0 and ${querySize}`);
				const messageFilter = (m: Message) => !isNaN(parseInt(m.content)) && m.author === msg.author;
				const messageCollector = msg.channel.createMessageCollector({ filter: messageFilter, time: 20 * 1000 });
				messageCollector.on('collect', async m => {
					query = parseInt(m.content);
					const response = results[query];
					if (response) {
						row.components[0]?.setDisabled(query <= 0);
						row.components[1]?.setDisabled(query >= querySize);
						embed.setImage(response.image);
						embed.setFooter(`Page: ${query}/${querySize}`);
						if (!safe)
							embed.setDescription(`[${response.title}](${response.url})`);
						await message.edit({ embeds: [ embed ], components: [ row ] });
						await collector.resetTimer();
					}
				});
				messageCollector.on('end', async collected => {
					if (msg.channel instanceof TextChannel) {
						await msg.channel.send('Ok...');
						await msg.channel.bulkDelete(collected);
					}
				});
				await i.update({ embeds: [ embed ], components: [ row ] });
			}
			else if (i.customId === 'Delete' && message.id === i.message.id) {
				await i.reply({ content: 'Ok!', ephemeral: true });
				await message.delete();
				collector.stop();
			}
		});
	}
};
export = command;