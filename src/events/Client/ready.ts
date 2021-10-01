import type { IEvent } from '../../typing/event.d';
import type { Client } from 'discord.js';
const event: IEvent = {
	label: 'ready',
	execute(session: Client): void {
		console.log('\x1b[36m%s\x1b[0m', `Logged in as ${session.user?.username}`);
		console.log(session.token);

	},
	once: true
};
export = event;