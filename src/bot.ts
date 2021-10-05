import type { ICommand } from './typing/command.d';
import type { IEvent } from './typing/event.d';

import { Intents, Client, Constants } from 'discord.js';
import handleAPICommands from './utils/api-handler';
import Options from './options';

import { readdirSync } from 'fs';
import { join } from 'path';

import './database/db';

const session = new Client({
	intents: [
		Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
		Intents.FLAGS.DIRECT_MESSAGE_TYPING,
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILDS
	],
	presence: {
		status: 'online',
		activities: [
			{
				name: Options.Prefix,
				type: Constants.ActivityTypes.LISTENING
			}
		]
	},
	shards: 'auto'
});

session.login();
session.on('error', console.error);
session.on('unhandledPromiseRejection', console.error);

export const events = new Map<string, IEvent>();
export const commands = new Map<string, ICommand>();
export const aliases = new Map<string, string>(); //todo

handleEvents('/events', session, events);
handleCommands('/commands', commands, aliases);
handleAPICommands(commands);

//event handler
function handleEvents(folder: string, s: Client, events: Map<string, IEvent>) {

	readdirSync(join(__dirname, folder)).forEach(async file => {
		if (!file.endsWith('.js')) {
			handleEvents(join(folder, file), s, events);
			return;
		}
		const event = <IEvent> await import(join(__dirname, folder, file));
		s[event.once ? 'once' : 'on'](event.label, (...args: any[]) => event.execute(...args)); //eslint-disable-line
		events.set(event.label, event);
		console.log('Loaded event %s', event.label);
	});
}

//command handler
function handleCommands(folder: string, commands: Map<string, ICommand>, aliases: Map<string, string>) {

	readdirSync(join(__dirname, folder)).forEach(async file => {
		if (!file.endsWith('.js')) {
			handleCommands(join(folder, file), commands, aliases);
			return;
		}
		const command = <ICommand> await import(join(__dirname, folder, file));
		if (command.options?.disabled !== true) {
			command.alias?.forEach(alias => aliases.set(alias, command.label ?? file));
			commands.set(command.label ?? file, command);
			console.log('Loaded command %s', command.label ?? file);
		}
	});
}