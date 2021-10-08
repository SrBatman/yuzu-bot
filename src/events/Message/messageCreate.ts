import type { Message, MessageOptions, MessagePayload, Guild } from 'discord.js';
import type { CommandOptions } from '../../typing/command.d';
import type { IEvent } from '../../typing/event.d';

import { MessageEmbed, Permissions } from 'discord.js';
import { commands, aliases } from '../../bot';

import Options from '../../options';
import * as Controller from '../../database/controllers/prefix.controller';

// out of the execute() scope
const cooldowns: Map<string, Map<string, number>> = new Map;

// event
const event: IEvent = {
	label: 'messageCreate',
	async execute(msg: Message): Promise<void> {
		// alias
		const session = msg.client;
		const prefix = await getPrefix(Options.Prefix, msg.guild as Guild | undefined);
		// arguments, ej: .command args0 args1 args2 ...
		const args = msg.content.slice(prefix.length).trim().split(/\s+/gm);
		const cmdName = <string> args.shift()?.toLowerCase();
		const command = commands.get(cmdName) ?? commands.get(aliases.get(cmdName) as string);
		const problem = await validateCommandExecution(msg, Options.Owner, command?.options);
		const mention = new RegExp(`^<@!?${session.user?.id}>( |)$`);

		if (msg.content.match(mention)) {
			msg.channel.send(`Mi prefix es ${prefix}`);
			return;
		}

		if (msg.author.bot)
			return;

		if (!msg.content.startsWith(prefix))
			return;

		if (!command) {
			msg.channel.send('Ese comando no existe \\🔒');
			return;
		}
		if (problem) {
			msg.channel.send(problem);
			return;
		}

		let timestamps: Map<string, number> | undefined;
		// cooldowns map
		if (!cooldowns.has(command.label)) cooldowns.set(command.label, new Map<string, number>());
		timestamps = cooldowns.get(command.label);

		if (msg.guild) {
			if (timestamps?.has(msg.guild.id)) {
				const expirationTime = (command.cooldown ?? 3) * 1000 + <number> timestamps?.get(msg.guild.id);
				if (Date.now() < expirationTime) {
					const timeLeft = new Date(expirationTime - Date.now()).getSeconds();
					//....
					msg.reply(`Estoy re caliente como para poder ejecutar más comandos \\🔥\nEspera **${timeLeft}** antes volver a usar **${command.label}**`);
					return;
				}
			}
			setTimeout(() => timestamps?.delete(msg.guild?.id as string), (command.cooldown ?? 3) * 1000);
			timestamps?.set(msg.guild.id, Date.now());
		}

		try {

			const output = <string | MessageEmbed | MessageOptions | MessagePayload | undefined> await command.execute(session)(msg, args);

			if (output) {
				if (!msg.guild?.me?.permissions.has(Permissions.FLAGS.SEND_MESSAGES))
					return;

				if (output instanceof MessageEmbed) {
					const sended = await msg.channel.send({ embeds: [ output ] });
					console.log('Sended message "%s" of id: %s executed with prefix %s', sended.embeds[0]?.description, sended.id, prefix);
				}
				else {
					const sended = await msg.channel.send(output);
					console.log('Sended message "%s" of id: %s executed with prefix %s', sended.content, sended.id, prefix);
				}
			}
		}

		catch (err: unknown) { console.error(err); }
	}
};
function validateCommandExecution(msg: Message, botOwnerId: string, commandOptions?: CommandOptions): string | undefined {

	if (!commandOptions)
		return;

	if (commandOptions.disabled)
		return 'El comando está desactivado';

	else if (commandOptions.guildOnly && !msg.guild)
		return 'Ese comando solo se puede ejecutar dentro de un servidor';

	else if (commandOptions.adminOnly && msg.author.id !== botOwnerId)
		return 'No sos el dueño del bot';

	else
		return undefined;
}
async function getPrefix(defaultPrefix: string, guild?: Guild) {
	if (guild) {
		const output = await Controller.get(guild.id);
		if (!output)
			return defaultPrefix;

		return output.prefix;
	}
	return defaultPrefix;
}
export = event;