import type { ICommand } from '../../types/command';
const command: ICommand = {
    label: 'ping',
    options: {
        guildOnly: false,
        adminOnly: false,
    },
    execute: () => () => 'Pong!'
};
export = command;