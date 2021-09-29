import type { ICommand } from './types/command';
import type { IEvent } from './types/event';

import Discord from 'discord.js';
import handleCommands from './command-handler';
import handleEvents from './event-handler';
import handleSlashCommands from './slashcommand-handler';
import handleAPICommands from './utils/api-handler';

import './database/db';
import './structures/Guild';
import 'process';

const token = process.env.TOKEN;

export const commands  = new Discord.Collection<string, ICommand>(),
	         scommands = new Discord.Collection<string, any>(),
             aliases   = new Discord.Collection<string, string>(),
             events    = new Discord.Collection<string, IEvent>(),
             session   = new Discord.Client();

handleEvents('/events', session, events);
handleCommands('/commands', commands, aliases, scommands);
handleSlashCommands(scommands);
handleAPICommands(commands);

if (token) session.login(token);

session.on('error', (error: Error) => console.error(error));
session.on('unhandledPromiseRejection', (error: Error) => console.error(error));