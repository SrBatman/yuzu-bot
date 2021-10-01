import type { TextChannel } from 'discord.js';
import type { ICommand } from '../../typing/command';
import { Util, Permissions } from 'discord.js';
import * as tagController from '../../database/controllers/tag.controller';
import options from '../../options';

type Argument = // the arguments passed
| 'add'
| 'set'
| 'new'
| 'remove'
| 'delete'
| 'give'
| 'gift'
| 'edit'
| 'list'
| 'nsfw'
| 'global'
| 'owner';

const OWNERID = options.owner;
const isArgument = (arg: unknown): arg is Argument =>
	arg instanceof String && arg === ('add' || 'set' || 'new' || 'remove' || 'delete' || 'edit' || 'list' || 'nsfw' || 'global' || 'owner');

const command: ICommand = {
	label: 'tag',
	alias: ['t'],
	options: {
		guildOnly: true,
		adminOnly: false
	},
	execute: () => async (msg, args) => {
		if (!msg.guild) return;

		const arg = <Argument | undefined | string> args?.[0]?.toLowerCase();
		const obtain = async (content: string) =>
			await tagController.get(content, msg.guild?.id); // eslint-disable-line

		switch (arg) {
		case 'new':
		case 'set':
		case 'add': {
			if (!args?.[1]) {
				msg.channel.send('Por favor debes especificar un nombre para tu tag');
				return;
			}
			const tag = await obtain(args?.[1]);
			const content = args?.slice(2)?.join(' ');

			if (!tag) {
				if (!content && msg.attachments.size < 1) {
					msg.channel.send('Escribe algo, no puedo guardar tags vacíos');
					return;
				}
				const output = await tagController.add(msg.guild.id, msg.author.id, content ?? ' ', args?.[1], msg.attachments.map(att => att.url));
				msg.channel.send(`Añadí el tag ${output.name}`);
			}
			else {
				msg.reply('ese tag ya existe');
				if (tag.global)
					msg.reply('ese tag es global');
			}
			break;
		}

		case 'delete':
		case 'remove': {
			if (!args?.[1]) {
				msg.channel.send('Por favor debes especificar un tag para borrar');
				return;
			}
			const tag = await obtain(args?.[1]);

			if (tag) {
				if (tag.user !== msg.author.id || !msg.member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
					if (msg.author.id !== OWNERID) {
						msg.channel.send('No sos dueño de ese tag');
						return;
					}
				}
				else if (tag.global && msg.author.id !== OWNERID) {
					msg.channel.send('El tag es global y no se puede eliminar');
					return;
				}
				await tagController.remove(msg.guild.id, msg.author.id, args?.[1]);
				msg.channel.send(`Removí el tag ${args[0]}`);
			}

			break;
		}

		case 'give':
		case 'gift': {
			if (!args?.[1]) {
				msg.channel.send('Por favor debes especificar un tag para regalar.');
				return;
			}
			const tag = await obtain(args?.[1]);
			const target = msg.mentions.users.first();

			if (!target)
				msg.channel.send('No encontré ese usuario');

			else {
				if (!tag) {
					msg.channel.send('No encontré el tag');
					return;
				}
				tagController.pass(tag, { server: msg.guild?.id, user: target.id }, tag?.nsfw, tag?.global);
			}

			break;
		}

		case 'edit': {
			if (!args?.[1]) {
				msg.channel.send('Por favor debes especificar un tag para editar');
				return;
			}
			const tag = await obtain(args?.[1]);
			const content = args?.slice(2)?.join(' ');

			if (tag)
				if (tag.user !== msg.author.id)
					msg.channel.send('No sos dueño de ese tag');
				else if (!content && msg.attachments.size < 1)
					msg.channel.send('Por favor debes especificar el contenido del tag');
				else {
					const output = await tagController.edit(tag, {
						content: content ?? '',
						attachments: msg.attachments.map(att => att.url)
					});
					msg.channel.send(`Edité el tag ${output?.name}`);
				}
			else msg.channel.send('No encontré ese tag');

			break;
		}

		case 'list': {
			const tags = await tagController.find(msg.guild.id, msg.mentions.users.first()?.id ?? msg.author.id);
			const list = Util.splitMessage(`'TAGS': #\n${tags.map(tag => tag.name).join(', ')}`);

			for (const tagsInList of list)
				msg.channel.send({ content: tagsInList });

			break;
		}

		case 'global': {
			if (!args?.[1]) {
				msg.channel.send('Por favor debes especificar un tag para convertir.');
				return;
			}
			const tag = await obtain(args?.[1]);

			if (!args?.[0])
				msg.channel.send('Error inesperado');

			if (tag?.user !== OWNERID)
				msg.channel.send('No sos dueño del bot');

			if (tag)
				// TODO
				if (!tag.global) {

					const output = await tagController.edit(tag, {
						content: tag.content,
						attachments: msg.attachments.map(att => att.url)
					}, true, false);
					msg.channel.send(`Edité el tag ${output?.name} para que se pueda usar en todos los servidores`);

				}
				else {
					const output = await tagController.edit(tag, {
						content: tag.content,
						attachments: msg.attachments.map(att => att.url)
					}, false, false);
					msg.channel.send(`Edité el tag ${output?.name} para que ya no se pueda usar en todos los servidores`);
				}
			else msg.channel.send('No encontré ese tag');

			break;
		}

		case 'nsfw': {
			if (!args?.[1]) {
				msg.channel.send('Por favor debes especificar un tag para convertir.');
				return;
			}
			const tag = await obtain(args?.[1]);

			if (!args?.[1])
				msg.channel.send('Por favor debes especificar el tag que querés volver nsfw');

			if (tag)
				if (tag.user !== msg.author.id && !msg.member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
					msg.channel.send('No sos dueño de ese tag');

				else if (tag.global)
					msg.channel.send('No se puede mostrar un tag global si es nsfw');

				else {
					const output = await tagController.edit(tag, { content: tag.content, attachments: tag.attachments }, false, true);
					msg.channel.send(`Edité el tag ${output?.name} para que se pueda usar solo en canales nsfw`);
				}
			else msg.channel.send('No encontré ese tag');

			break;
		}

		case 'owner': {
			if (!args?.[1]) {
				msg.channel.send('Por favor debes especificar un tag.');
				return;
			}
			const tag = await obtain(args?.[1]);

			if (tag)
				msg.channel.send(`ID: ${tag.user}`);

			else msg.channel.send('No encontré ese tag');

			break;
		}

		default: {
			if (!isArgument(arg) && args?.[0]) {
				const tag = await tagController.get(args?.[0], msg.guild.id);
				if (!tag)
					msg.channel.send('No se ha encontrado el tag');

				else if (tag?.nsfw && !(msg.channel as TextChannel).nsfw) // eslint-disable-line
					msg.channel.send('Contenido nsfw, lo sentimos pero no se puede mostrar en éste canal :underage:');

				else {
					if (tag?.global && tag?.nsfw) msg.channel.send('Ha habido un fallo en el sistema');
					msg.channel.send({ content: tag?.content, files: tag.attachments });
				}
			}
			break;
		}
		}
	}
};
export = command;