import type { ICommand } from './types/command';
import type { IEvent } from './types/event';

import { Client } from 'discord.js';

import handleCommands from './command-handler';
import handleEvents from './event-handler';

import 'dotenv/config';
import './database/db';
import './structures/Guild';

export const commands = new Map<string, ICommand>(),
             aliases  = new Map<string, string>(),
             events   = new Map<string, IEvent>(),
             session  = new Client;

export default async function init(token: string = process.env.token!) {

    handleEvents('/events', session, events);
    handleCommands('/commands', commands, aliases);

    return session.login(token);
};