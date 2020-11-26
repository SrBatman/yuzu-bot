import type { ICommand } from './types/command';
import { readdirSync } from 'fs';
import { join } from 'path';

export = function handleCommands(dir: string, commands: Map<string, ICommand>, aliases: Map<string, string>) {
    readdirSync(join(__dirname, dir)).forEach(async file => {
        if (!file.endsWith('.js')) {
            handleCommands(join(dir, file), commands, aliases);
            return;
        }
        const { command }: { command: ICommand } = await import(join(__dirname, dir, file));

        if (command.alias instanceof Array) aliases.forEach(a => aliases.set(command.label, a));
        commands.set(command.label, command);
        console.log('Command %s loaded', command.label);
    });
};