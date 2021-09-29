import type { IEvent } from '../../types/event';
import type { Client, /* Interaction */ } from 'discord.js';
import type { MessageContent } from '../../types/command';
import { commands } from '../../bot';

type Interaction = any; //TODO
export const event: IEvent = {
    label: 'interactionCreate',
    async execute(session: Client, interaction: Interaction): Promise<void> {
        if (!interaction.isCommand()) return;

        const command = commands.get(interaction.commandName);

        if (!command) return;

        try {
            const output: MessageContent = await command.execute(session)(interaction, interaction?.command?.options);
            interaction.reply(output);
        }
        catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}