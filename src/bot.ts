import type { ICommand } from './typing/command.d';
import type { IEvent } from './typing/event.d';

import { Intents, Client } from 'discord.js';
import handleAPICommands from './utils/api-handler';

import { readdirSync } from 'fs';
import { join } from 'path';

import './database/db';

export const commandFiles = new Map<string, ICommand>();
export const commandAliases = new Map<string, string>(); //todo
export const eventFiles = new Map<string, IEvent>();

const session = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.DIRECT_MESSAGE_TYPING,
		Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS
	]
});

session.login();
session.on('error', console.error);
session.on('unhandledPromiseRejection', console.error);


handleEvents('/events', eventFiles, session);
handleCommands('/commands', commandFiles, commandAliases);
handleAPICommands(commandFiles);

function handleEvents(folder: string, events: Map<string, IEvent>, s: Client) {
	readdirSync(join(__dirname, folder)).forEach(async file => {
		if (!file.endsWith('.js')) {
			handleEvents(join(folder, file), events, s);
			return;
		}
		const event = <IEvent> await import(join(__dirname, folder, file));
		s[event.once ? 'once' : 'on'](event.label, (...args: any[]) => event.execute(...args)); //eslint-disable-line
		events.set(event.label, event);
		console.log('Loaded event %s', event.label);
	});
}
function handleCommands(folder: string, commands: Map<string, ICommand>, aliases: Map<string, string>) {
	readdirSync(join(__dirname, folder)).forEach(async file => {
		if (!file.endsWith('.js')) {
			handleCommands(join(folder, file), commands, aliases);
			return;
		}
		const command = <ICommand> await import(join(__dirname, folder, file));
		command.alias?.forEach(alias => aliases.set(alias, command.label ?? file));
		commands.set(command.label ?? file, command);
		console.log('Loaded command %s', command.label ?? file);
	});
}