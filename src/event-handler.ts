import type { IEvent } from './types/event';
import type { Client } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';

export = function handleEvents(dir: string, s: Client, events: Map<string, IEvent>) {
    readdirSync(join(__dirname, dir)).forEach(async file => {
        if (!file.endsWith('.js')) {
            handleEvents(join(dir, file), s, events);
            return;
        }
        const { event }: { event: IEvent } = await import(join(__dirname, dir, file));
        s.on(event.label, event.execute.bind(undefined, s));
        events.set(event.label, event);
        console.log('Event %s loaded!', event.label);
    });
};