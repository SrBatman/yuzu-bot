import type { Client as Session,
    StringResolvable,
    APIMessageContentResolvable,
    MessageOptions,
    MessageAdditions,
    PermissionString,
    Message, 
    Snowflake } from 'discord.js';

export type MessageContent =
    | MessageOptions & { split?: false }
    | MessageAdditions
    | StringResolvable
    | APIMessageContentResolvable;

export type Category =
    | 'fun'
    | 'util'
    | 'moderation'
    | 'admin'
    | 'owner'
    | 'none';

export type CommandOptions = {
    guildOnly: boolean, // if the command can be executed on dm
    adminOnly: boolean,
    permissions?: PermissionString[],
    permissionsForClient?: PermissionString[],
    argsRequired?: {
        message: MessageContent,
        required: boolean,
    },
};

export interface ICommand {
    readonly label: string; // the name of the command
    readonly category?: Category; // TODO
    readonly alias?: string[]; // aliases like ['avatar', 'pfp', 'icon']
    readonly allowedIDS?: Snowflake[] | 'all';
    readonly cooldown?: (number | 3);
    readonly options: CommandOptions;
    readonly information?: {
        descr?: string, // description
        usage?: string, // duh
        short?: string, // short description
    };
    // curry function
    readonly execute: (session: Session) =>
        (msg: Message, args: readonly string[]) =>
            MessageContent | Promise<MessageContent> | undefined | Promise<undefined>;
}