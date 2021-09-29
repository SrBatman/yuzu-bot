import superagent from 'superagent';
import { MessageEmbed } from 'discord.js';
import type { Client, Message } from 'discord.js';
import type { ICommand } from '../typing/command.d';


const API = 'https://nekos.life/api/v2/';
const endpoints: readonly string[] = [
	'img/hug',
	'img/kiss',
	'img/poke',
	'img/tickle',
	'img/pat',
	'img/cuddle',
	'img/punch',
];

const handle = (commands: Map<string, ICommand>) => endpoints.forEach(cmd => {

	function getDescription(command: string, msg: Message, session: Client): string {
		const action = command.slice(4, command.length),
			  author = msg.author,
			  member = msg.mentions.users.first() ?? session.user

		const desc = `${author} received a ${action} from ${member}`;

		return desc;
	}

	const commandName = cmd.slice(4, cmd.length);
	console.log('\x1b[33m%s\x1b[0m', `Loaded command ${commandName}`);

	commands.set(commandName, {
		label: commandName,
		options: {
			guildOnly: true,
			adminOnly: false,
			information: {
				descr: `Command for giving a ${commandName} to someone`,
				usage: `[@User]`,
				short: `Command for giving a ${commandName}`
			},
		},
		cooldown: 3,
		execute: (session) => async (msg) => new MessageEmbed()
				.setDescription(getDescription(cmd, msg, session))
				.setColor('RANDOM')
				.setImage((await superagent.get(API + cmd)).body.url)
	});
});
export = handle;