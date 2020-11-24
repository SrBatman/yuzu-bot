import type { ICommand } from './types/command';
import { readdirSync } from 'fs';
import { join } from 'path';

type Format = {
    commands: Map<string, ICommand>,
    aliases: Map<string, string>
};

export = async function handleCommands(dir: string, { commands, aliases }: Format) {
    // added sub-directory support!
    return new Promise<Format>((resolve) => {
        readdirSync(join(__dirname, dir)).forEach(async (file) => {
            if (!file.endsWith('.js')) {
                await handleCommands(join(dir, file), { commands, aliases });
                return;
            }
            const { command }: { command: ICommand } = await import(join(__dirname, dir, file));
            const { label, alias } = command;

            if (alias instanceof Array) aliases.forEach(a => aliases.set(label, a));
            commands.set(label, command);
        });
        resolve({ commands, aliases });
    });
};