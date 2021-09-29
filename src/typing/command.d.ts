import type { Client as Session,
    StringResolvable,
    APIMessageContentResolvable,
    MessageOptions,
    MessagePayload,
    MessageAdditions,
    PermissionString,
    Message, 
    Snowflake } from 'discord.js';
export type MessageContent =
    | MessageOptions
    | MessagePayload
    | string
    | MessageEmbed

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
    allowedIDS?: Snowflake[];
    disabled?: boolean | false,
    argsRequired?: {
        message: MessageContent,
        required: boolean,
    },
    information?: {
        descr?: string, // description
        usage?: string, // duh
        short?: string, // short description
    };
};

export interface ICommand {
    label?: string; // the name of the command
    // category?: Category; // TODO
    alias?: string[]; // aliases like ['avatar', 'pfp', 'icon']
    cooldown?: (number | 3);
    options?: CommandOptions;
    execute: (session: Session) =>
        (msg: Message, args: readonly string[]) =>
            MessageContent | Promise<MessageContent>;
}