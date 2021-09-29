import type { Message } from 'discord.js';
import type { CommandOptions, MessageContent } from '../../typing/command.d';
import type { IEvent } from '../../typing/event.d';
import type { Client, MessageOptions } from 'discord.js';

import { options } from '../../options';
import { aliases, commands } from '../../bot';
import { MessageEmbed } from 'discord.js';
import * as Controller from '../../database/controllers/prefix.controller';

const cooldowns = new Map<string, Map<string, number>>();

export const event: IEvent = {
	label: 'messageCreate',
	async execute(msg: Message): Promise<void> {
		console.log('Event messageCreate called');
		const session: Client = msg.client;
		// get the custom prefix from de database
		const prefix  = msg.guild ? (await Controller.get(msg.guild.id))?.prefix ?? options.prefix : options.prefix;
		// arguments, ej: .command args0 args1 args2 ...
		const args    = msg.content.slice(prefix.length).trim().split(/\s+/gm),
			  name    = args.shift()?.toLowerCase(), // command name
			  command = commands.get(name!) ?? commands.get(aliases.get(name!)!);

		const error: MessageContent = validateCommandExecution(msg, command?.options);
		if (!msg.content.startsWith(prefix) || msg.author.bot) {
			return;
		}
		else if (!command) {
			msg.channel.send('Ese comando no existe.');
			return;
		}
		else if (error) {
			msg.channel.send(error);
			return;
		}
		else {
			if (!!command.label) {
			// cooldowns map
				if (!cooldowns.has(command.label)) cooldowns.set(command.label, new Map<string, number>());
				// using var because the global scope
				var timestamps: Map<string, number> | undefined = cooldowns.get(command.label);
			}
		}
		if (timestamps?.has(msg.guild?.id!)) {
			const expirationTime: number | 3000 = ((command.cooldown ?? 3000) * 1000) + (timestamps?.get(msg.guild?.id!) ?? 3000);
			if (Date.now() < expirationTime) {
				const timeLeft = new Date(expirationTime - Date.now()).getSeconds();
				//....
				console.log(expirationTime)
				msg.channel.send(`estoy re caliente como para poder ejecutar más comandos \\🔥\nEspera **${timeLeft}** antes volver a usar **${command.label}**`);
				return;
			}
		}

		setTimeout(() => timestamps?.delete(msg.guild?.id!)!, (command.cooldown ?? 3) * 1000);
		timestamps?.set(msg.guild?.id!, Date.now());

		const output: MessageContent = await command.execute(session)(msg, args);

		if (output) {
			var response: MessageOptions = {};
			if (output instanceof MessageEmbed) response.embeds = [ output ];
			else response.content = output;
			const sended: Message = await msg.channel.send(response);
			console.log('Sended message "%s" of id: %s executed with prefix %s', sended.content, sended.id, prefix);
		}
	}
};

function validateCommandExecution(msg: Message, commandOptions?: CommandOptions): MessageContent | void {

	const { prefix, owner } = options;

	if (!commandOptions)
		return;

	if (commandOptions.disabled)
		return 'El comando está desactivado';

	if (commandOptions.argsRequired && !commandOptions.argsRequired.message)
		return `Uso incorrecto, por favor use ${prefix}help \`<Comando>\` para más información`;

	if (commandOptions.argsRequired && commandOptions.argsRequired.message)
		return commandOptions.argsRequired.message;

	if (commandOptions.guildOnly && !msg.guild)
		return 'Ese comando solo se puede ejecutar dentro de un servidor';

	if (commandOptions.adminOnly && msg.author.id !== owner.id)
		return 'No sos el dueño del bot';

}