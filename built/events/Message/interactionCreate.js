"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const tslib_1 = require("tslib");
const bot_1 = require("../../bot");
exports.event = {
    label: 'interactionCreate',
    execute(session, interaction) {
        var _a;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (!interaction.isCommand())
                return;
            const command = bot_1.commands.get(interaction.commandName);
            if (!command)
                return;
            try {
                const output = yield command.execute(session)(interaction, (_a = interaction === null || interaction === void 0 ? void 0 : interaction.command) === null || _a === void 0 ? void 0 : _a.options);
                interaction.reply(output);
            }
            catch (error) {
                console.error(error);
                yield interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        });
    }
};
