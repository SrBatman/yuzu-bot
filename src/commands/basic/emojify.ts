import type { ICommand } from '../../typing/command.d';
const command: ICommand = {
	label: 'emojify',
	options: {
		guildOnly: false,
		adminOnly: false
	},
	execute: () => (_, args) => {
		const MAPPING: { [ key: string ]: string } = {
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

		return args.join(' ')
			.split('')
			.map(c => MAPPING[c] || c)
			.join('');
	}
};
export = command;