import type { ICommand } from '../../typing/command.d';
// import { SlashCommandBuilder as CommandBuilder } from '@discordjs/builders';

namespace Command {
    // data: new CommandBuilder()
    //     .setDescription('Ping')
    //     .setName('ping'),
    export const command: ICommand = {
        label: 'ping',
        alias: [],
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
}
export = Command.command;