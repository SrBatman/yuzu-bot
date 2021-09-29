import type { ICommand } from '../../types/command';
import { SlashCommandBuilder as CommandBuilder } from '@discordjs/builders';

const command: ICommand = {
    data: new CommandBuilder()
        .setDescription('Ping')
        .setName('ping'),
    label: 'ping',
    alias: ['pfp', 'pic'],
    options: {
        guildOnly: false,
        adminOnly: false,
        information: {
            descr: 'Ping',
            short: 'Ping',
            usage: ''
        },
    },
    execute: () => () => 'Pong!'
};
export = command;