import type { Snowflake } from 'discord.js';

export type Options = {
	sharded: {
		isSharded: boolean,
		shardCount: number | 'auto'
	},
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
	sharded: {
		isSharded: false,
		shardCount: 'auto'
	},
	owner: {
		username: '',
		id: ''
	},
	disabledCommands: [
		'...'
	],
	prefix: '!',
	voice: {
		voiceSupport: false
	}
};