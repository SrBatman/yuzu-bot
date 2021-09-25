import type { CommandOptions } from '../types/command.d';
export function command(
        label: string,
        alias?: readonly string[],
        cooldown: number = 3,
        options?: CommandOptions,
    ): Function {
    return (command: any): void => {
        command.label = label;
        command.cooldown = cooldown;
        command.alias = alias;
        command.options = options;
    };
};