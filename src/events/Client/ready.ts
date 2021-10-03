import type { IEvent } from '../../typing/event.d';
import type { Client } from 'discord.js';
const event: IEvent = {
	label: 'ready',
	execute(session: Client): void {
		console.log('\x1b[36m%s\x1b[0m', `Logged in as ${session.user?.username}`);
		console.log(`[MEMORY] ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`);
	},
	once: true
};
export = event;