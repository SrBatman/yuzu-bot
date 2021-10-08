import type { Client as Session, PermissionString, Message, Snowflake, MessageOptions, CommandInteraction, CommandInteractionOptionResolver } from 'discord.js';
import type { SlashCommandBuilder } from 'discord.js/api/v9';
export type MessageContent =
    | MessageEmbed
    | MessageOptions
    | string
    | undefined;

export type Category =
    | 'fun'
    | 'util'
    | 'moderation'
    | 'admin'
    | 'owner'
    | 'none';

export type CommandOptions = {
    guildOnly?: boolean | false, // if the command can be executed on dm
    adminOnly?: boolean | false,
    permissions?: PermissionString[],
    permissionsForClient?: PermissionString[],
    disabled?: boolean | false,
    information?: {
        descr?: string, // description
        usage?: string, // duh
        short?: string, // short description
    };
};

export interface ICommand {
    label: string; // the name of the command
    // category?: Category; // TODO
    alias?: string[]; // aliases like ['avatar', 'pfp', 'icon']
    cooldown?: (number | 3);
    options?: CommandOptions;
    execute: (session: Session) =>
        (msg: Message, args: string[]) =>
            MessageContent | Promise<MessageContent>;
}

// slash commands
export interface ISlashCommand {
    public options?: CommandOptions;
    public data: SlashCommandBuilder;
    public execute: (interaction: Interaction, args: CommandInteractionOptionResolver) => MessageContent | Promise<MessageContent>;
}