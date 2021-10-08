import type { ICommand } from '../../typing/command.d';
import { MessageEmbed } from 'discord.js';
import { transpile } from 'typescript';
import { inspect } from 'util';
import Options from '../../options';
const command: ICommand = {
	label: 'eval',
	options: {
		guildOnly: true,
		adminOnly: false
	},
	execute: session => (msg, args) => {
		if (msg.author.id !== Options.Owner)
			return 'Qué hacés solo el dueño puede usar eso';

		const entry = args?.join(' ');
		const exit = inspect(eval(transpile(entry)));

		if (exit)
			return new MessageEmbed()
				.setAuthor(msg.member?.nickname ?? msg.author.username, msg.author.displayAvatarURL())
				.setColor('RANDOM')
				.setTitle('Eval')
				.addField(`Evaluado en:`, `\`\`\`ts\n${session.ws.ping}ms\`\`\``, true)
				.addField('Entrada :inbox_tray:', `\`\`\`ts\n${entry}\`\`\``, true)
				.addField('Salida :outbox_tray:', `\`\`\`ts\n${exit}\`\`\``, true)
				.addField('Tipo :bar_chart:', `\`\`\`ts\n${typeof exit}\`\`\``, true);
		else
			return 'Escribe algo.';
	}
};
export = command;