"use strict";
const command = {
    label: 'edited',
    options: {
        guildOnly: false,
        adminOnly: false,
        information: {
            descr: 'Wtf',
            short: '._.XD',
            usage: ''
        }
    },
    execute: () => (msg) => msg.channel.send('Hola!').then(m => m.edit('   ‫  Hola    ‫  '))
};
module.exports = command;
