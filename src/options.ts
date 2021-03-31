import type { Snowflake } from 'discord.js';

export type Options = {
	owner: {
		username: string,
		id: Snowflake
	},
	disabledCommands: readonly string[],
	readonly prefix: '!' | '.',
	voice: {
		voiceSupport: boolean,
	}
};

export const options: Options = {
	owner: { // TODO
		username: 'Azul 💧#2189',
		id: '659611986413355018'
	},
	disabledCommands: [
		'test'
	],
	prefix: '!',
	voice: {
		voiceSupport: false
	}
};