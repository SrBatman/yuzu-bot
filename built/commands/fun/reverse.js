"use strict";
const command = {
    label: 'reverse',
    alias: ['invert'],
    options: {
        guildOnly: false,
        adminOnly: false,
        information: {
            descr: 'Invierte un texto voltéandolo hacia abajo.',
            short: 'Invertir textos.',
            usage: '<$Texto>'
        }
    },
    execute: () => (_, args) => {
        const MAPPING = '¡"#$%⅋,)(*+\'-˙/0ƖᄅƐㄣϛ9ㄥ86:;<=>¿@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Z[/]^_`ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz{|}~';
        const OFFSET = '!'.charCodeAt(0);
        if (args.length < 1)
            return 'Debes proporcionar el texto para hacerle flip.';
        return args.join(' ')
            .split('')
            .map(c => c.charCodeAt(0) - OFFSET)
            .map(c => { var _a; return (_a = MAPPING[c]) !== null && _a !== void 0 ? _a : ' '; })
            .reverse()
            .join('');
    }
};
module.exports = command;
