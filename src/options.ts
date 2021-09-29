import type { Snowflake } from 'discord.js';

export type Options = {
	owner: {
		username: string,
		id: Snowflake //TODO
	},
	disabledCommands: readonly string[],
	readonly prefix: '!' | '.' | '->',
	voice: {
		voiceSupport: boolean,
	}
};

export const options: Options = {
	owner: { // TODO
		username: 'Azul#8348',
		id: ''
	},
	disabledCommands: [
		'test'
	],
	prefix: '->',
	voice: {
		voiceSupport: false
	}
};