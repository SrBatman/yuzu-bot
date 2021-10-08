import type { ISlashCommand } from '../../typing/command.d';
import type { Interaction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

const command: ISlashCommand = {
	options: {
		guildOnly: false,
		adminOnly: false,
		information: {
			descr: 'Ping',
			short: 'Ping',
			usage: ''
		}
	},
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with pong!'),

	execute(i: Interaction) {
		return `pong! \\🏓 ${Math.floor(i.client.ws.ping)}ms`;
	}
}
export = command;