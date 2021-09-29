import type { IEvent } from '../../typing/event.d';
import type { Client } from 'discord.js';
export const event: IEvent = {
    label: 'ready',
    async execute(session: Client): Promise<void> {
        console.log('\x1b[36m%s\x1b[0m', `Logged in as ${session.user?.username}`);
        console.log(session.token);
        return;
    },
    once: true
};