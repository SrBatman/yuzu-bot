import type { ICommand } from '../../typing/command.d';
const command: ICommand = {
    label: 'edited',
    options: {
        guildOnly: false,
        adminOnly: false,
        information: {
            descr: 'Wtf',
            short: '._.XD',
            usage: ''
        },
    },
    execute: () => (msg) => msg.channel.send('Hola!').then(m => m.edit('   ‫  Hola    ‫  '))
};
export = command;