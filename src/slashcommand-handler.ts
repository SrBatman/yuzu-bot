import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Collection } from 'discord.js';
const clientId = '839719220979695626';
const guildId = '891367004903182336';
export = async function(scommands: Collection<string, any>) {
	const token = process.env.TOKEN;
	const rest = new REST({ version: '9' });
	if (token) rest.setToken(token);
	try {
		console.log('Started refreshing application (/) commands.');
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: [...scommands.values()] },
		);
		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: [...scommands.values()] },
		);
		console.log('Successfully reloaded application (/) commands.');
	}
	catch (error) {
		console.warn(error);
	}
};