import type { Client as Session } from 'discord.js';
export interface IEvent {
    label: string;
    execute:(...args: any[]) => any;
    once?: boolean;
}