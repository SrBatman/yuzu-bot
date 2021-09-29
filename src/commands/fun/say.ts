import type { ICommand } from '../../typing/command.d';
const command: ICommand = {
    label: 'say',
    alias: ['esay', 'shadowsay'],
    options: {
        guildOnly: false,
        adminOnly: false,
        information: {
            descr: 'Hace que el bot diga algo muy malo',
            short: 'Escribir el siguiente mensaje del bot.',
            usage: ''
        },
    },
    execute: () => (msg, args) => {
        const text = args.join(' ');
        if (!text)
            return 'Escribí el contenido del mensaje o te revoleo a piñas.';
        msg.delete();
        return text;
    }
};
export = command;