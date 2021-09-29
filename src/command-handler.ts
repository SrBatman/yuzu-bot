import type { ICommand } from './types/command';
import { readdirSync } from 'fs';
import { join } from 'path';

export = function handleCommands(dir: string, commands: Map<string, ICommand>, aliases: Map<string, string>, scommands: Map<string, any>) {
    readdirSync(join(__dirname, dir)).forEach(async file => {
        if (!file.endsWith('.js')) {
            handleCommands(join(dir, file), commands, aliases, scommands);
            return;
        }
        const command: ICommand = await import(join(__dirname, dir, file));
        if (!command.label) command.label = file;

        command.alias?.forEach(alias => aliases.set(alias, command.label!));
        commands.set(command.label, command);
        console.log('Command %s loaded', command.label);
        if (command.data) scommands.set(command.label, command.data?.toJSON());
    });
};