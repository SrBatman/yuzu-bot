"use strict";
const tslib_1 = require("tslib");
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const clientId = '839719220979695626';
const guildId = '891367004903182336';
module.exports = function (scommands) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const token = process.env.TOKEN;
        const rest = new rest_1.REST({ version: '9' });
        if (token)
            rest.setToken(token);
        try {
            console.log('Started refreshing application (/) commands.');
            yield rest.put(v9_1.Routes.applicationGuildCommands(clientId, guildId), { body: [...scommands.values()] });
            yield rest.put(v9_1.Routes.applicationCommands(clientId), { body: [...scommands.values()] });
            console.log('Successfully reloaded application (/) commands.');
        }
        catch (error) {
            console.warn(error);
        }
    });
};
