import type { Client as Session } from 'discord.js';
export interface IEvent {
    readonly label?: string;
    readonly execute:<EventOutput>(session: Session, ...args: any[]) => EventOutput;
}