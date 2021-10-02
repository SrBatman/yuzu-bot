"use strict";
const command = {
    label: 'emojify',
    options: {
        guildOnly: false,
        adminOnly: false,
        information: {
            descr: 'Reemplaza texto por emotes.',
            short: 'Reemplaza texto por emotes',
            usage: '<Texto>'
        }
    },
    execute: () => (_, args) => {
        const text = args.join(' ');
        if (!text)
            return 'Escribe algo';
        const MAPPING = {
            ' ': '   ',
            '0': ':zero:',
            '1': ':one:',
            '2': ':two:',
            '3': ':three:',
            '4': ':four:',
            '5': ':five:',
            '6': ':six:',
            '7': ':seven:',
            '8': ':eight:',
            '9': ':nine:',
            '!': ':grey_exclamation:',
            '?': ':grey_question:',
            '#': ':hash:',
            '*': ':asterisk:'
        };
        'abcdefghijklmnopqrstuvwxyz'.split('').forEach(c => { MAPPING[c] = MAPPING[c.toUpperCase()] = ` :regional_indicator_${c}:`; });
        return text.split('').map(c => MAPPING[c] || c).join('');
    }
};
module.exports = command;
