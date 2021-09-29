import type { IEvent } from '../../types/event';
import type { Client } from 'discord.js';
export const event: IEvent = {
    label: 'ready',
    execute(session: Client): void {
        console.log('Logged in as %s', session.user?.username);
        console.log(session.token);
        return;
    }
}