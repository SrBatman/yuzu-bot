import type { Interaction } from 'discord.js';
import { slashCommands } from '../../bot';
import { MessageEmbed } from 'discord.js';

const event = {
	label: 'interactionCreate',
	async execute(interaction: Interaction) {
		if (!interaction.isCommand()) return;

		const command = slashCommands.get(interaction.commandName);

		if (!command) return;

		try {
			const args = interaction.options;
			const output = await command.execute(interaction, args);
			if (output instanceof MessageEmbed) {
				await interaction.reply({ embeds: [ output ] });
			}
			else {
				await interaction.reply({ content: output });
			}
		}
		catch (err: unknown) {
			console.error(err);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
};
export = event;