import type { ICommand } from './typing/command.d';
import type { IEvent } from './typing/event.d';
import type { Client } from 'discord.js';

import Discord, { Intents } from 'discord.js';
import handleAPICommands from './utils/api-handler';

import { readdirSync } from 'fs';
import { join } from 'path';

import 'process';
import 'dotenv/config';
import './database/db';

const token = process.env.TOKEN;

export const commands = new Map<string, ICommand>(),
             aliases  = new Map<string, string>(),
             events   = new Map<string, IEvent>();

const session = new Discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES
    ]
});
handleEvents('/events', session);
handleCommands('/commands', commands, aliases);
handleAPICommands(commands);

if (token) session.login(token);

session.on('error', console.error);
session.on('unhandledPromiseRejection', console.error);

function handleEvents(folder: string, s: Client) {
    readdirSync(join(__dirname, folder)).forEach(async file => {
        if (!file.endsWith('.js')) {
            handleEvents(join(folder, file), s);
            return;
        }
        const { event }: { event: IEvent } = await import(join(__dirname, folder, file));

        s.on(event.label, (...args: any[]) => event.execute(...args));
        events.set(event.label, event);
        console.log('\x1b[31m%s\x1b[0m', `Event ${event.label} loaded!`);
    });
}
function handleCommands(folder: string, commands: Map<string, ICommand>, aliases: Map<string, string>) {
    readdirSync(join(__dirname, folder)).forEach(async file => {
        if (!file.endsWith('.js')) {
            handleCommands(join(folder, file), commands, aliases);
            return;
        }
        const command: ICommand = await import(join(__dirname, folder, file));
        if (!command.label) command.label = file;

        command.alias?.forEach(alias => aliases.set(alias, command.label!));
        commands.set(command.label, command);
        console.log('\x1b[34m%s\x1b[0m', `Command ${command.label} loaded`);
    });
};