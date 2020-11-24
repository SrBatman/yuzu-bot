import type { MessageContent, CommandOptions, ICommand } from './types/command';
import type { Message } from 'discord.js';
import type { GuildStructure } from './structures/Guild';

import { Client } from 'discord.js';
import { options } from './options';
import handleCommands from './command-handler';

import 'dotenv/config';
import './database/db';
import './structures/Guild';

export = async function init(token: string = process.env.token!) {
    // handler
    const commands = new Map<string, ICommand>(),
          aliases  = new Map<string, string>(),
          session  = new Client;

    await handleCommands('/commands', { commands, aliases });
    console.log('%d commands loaded!',commands.size);

    // events
    session.on('message', async (msg: Message): Promise<void> => {

        const guild  = msg.guild as GuildStructure,
              resp   = await guild.getPrefix(),
              prefix = resp?.prefix || options.prefix;

        // arguments, ej: .command args0 args1 args2 ...
        const args    = msg.content.slice(prefix.length).trim().split(/\s+/gm),
              name    = args.shift()?.toLowerCase(), // command name
              command = commands.get(name!) ?? commands.get(aliases.get(name!)!); // command object    

        const error: MessageContent = await validateCommandExecution(msg, command?.options);

        if (!msg.content.startsWith(prefix) || msg.author.bot) {
            return;
        }

        if (error) {
            msg.channel.send(error);
            return;
        }

        if (!command) {
            msg.channel.send('Ese comando no existe.');
            return;
        }
                                                             // curry 
        const output: MessageContent = await command?.execute(session)(msg, args);
        const sended: Message = await msg.channel.send(output);
        // TODO
        console.log('Sended message "%s" of id: %s executed with prefix %s', sended.content, sended.id, prefix);
    });
    session.once('ready', (): void =>
        console.log('Logged in as %s', session.user?.tag));

    // login & return the token
    return session.login(token);
};

async function validateCommandExecution(msg: Message, commandOptions?: CommandOptions): Promise<MessageContent | void> {

    const { prefix, owner } = options;

    if (!commandOptions)
        return;

    if (commandOptions.argsRequired && !commandOptions.argsRequired.message)
        return `Uso incorrecto, por favor use ${prefix}help \`<Comando>\` para más información`;

    if (commandOptions.argsRequired && commandOptions.argsRequired.message)
        return commandOptions.argsRequired.message;

    if (commandOptions.guildOnly && !msg.guild)
        return 'Ese comando solo se puede ejecutar dentro de un servidor';

    if (commandOptions.adminOnly && msg.author.id !== owner.id)
        return 'No sos el dueño del bot';

}