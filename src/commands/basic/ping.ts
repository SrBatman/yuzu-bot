import type { ICommand } from '../../types/command';
export const command: ICommand = {
    label: 'ping',
    options: {
        guildOnly: false,
        adminOnly: false,
    },
    execute: () => () => 'Pong!'
};