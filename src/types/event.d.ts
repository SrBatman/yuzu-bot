import type { Client as Session } from 'discord.js';
export interface IEvent {
    label: string;
    execute:(session: Session, ...args: any[]) => any;
}