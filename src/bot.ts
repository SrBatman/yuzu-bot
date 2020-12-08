import type { ICommand } from './types/command';
import type { IEvent } from './types/event';

import Discord from 'discord.js';
import handleCommands from './command-handler';
import handleEvents from './event-handler';

import './database/db';
import './structures/Guild';

export const commands = new Map<string, ICommand>(),
	         aliases  = new Map<string, string>(),
	         events   = new Map<string, IEvent>(),
	         session  = new Discord.Client();

handleEvents('/events', session, events);
handleCommands('/commands', commands, aliases);

session.login(process.env.token!);