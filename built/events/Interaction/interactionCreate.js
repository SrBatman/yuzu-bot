"use strict";
const bot_1 = require("../../bot");
const discord_js_1 = require("discord.js");
const event = {
    label: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isCommand())
            return;
        const command = bot_1.slashCommands.get(interaction.commandName);
        if (!command)
            return;
        try {
            const args = interaction.options;
            const output = await command.execute(interaction, args);
            if (output instanceof discord_js_1.MessageEmbed) {
                await interaction.reply({ embeds: [output] });
            }
            else {
                await interaction.reply({ content: output });
            }
        }
        catch (err) {
            console.error(err);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
};
module.exports = event;
