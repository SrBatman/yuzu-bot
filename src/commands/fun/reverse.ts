import type { ICommand } from '../../typing/command.d';
const command: ICommand = {
	label: 'reverse',
	alias: ['invert'],
	options: {
		guildOnly: false,
		adminOnly: false,
		information: {
			descr: 'Invierte un texto voltéandolo hacia abajo.',
			short: 'Invertir textos.',
			usage: '<Texto>'
		}
	},
	execute: () => (_, args) => {
		const MAPPING = '¡"#$%⅋,)(*+\'-˙/0ƖᄅƐㄣϛ9ㄥ86:;<=>¿@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Z[/]^_`ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz{|}~';
		const OFFSET  = '!'.charCodeAt(0); // Start with the character '!'

		if (args.length < 1)
			return 'Escribe algo';

		return args.join(' ')
			.split('')
			.map(c => c.charCodeAt(0) - OFFSET)
			.map(c => MAPPING[c] ?? ' ')
			.reverse()
			.join('');
	}
};
export = command;