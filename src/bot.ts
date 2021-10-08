import type { ICommand } from './typing/command.d';
import type { IEvent } from './typing/event.d';
import type { GuildMember, User } from 'discord.js';

import { readdirSync } from 'fs';
import { join } from 'path';
import { Intents, Client, Constants, MessageEmbed } from 'discord.js';

import Options from './options';
import superagent from 'superagent';

import './database/db';

// command handler v2
import type { ISlashCommand } from './typing/command.d';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

class Main {

	// event handler
	public static events: Map<string, IEvent> = new Map;

	// command handler v1
	public static commands: Map<string, ICommand> = new Map;
	public static aliases: Map<string, string> = new Map;

	// command handler v2
	public static slashCommands: Map<string, ISlashCommand> = new Map;

	// ...
	public static handleApiCommands(commands: Map<string, ICommand>): void {
		const api = 'https://nekos.life/api/v2/';
		const endpoints: `img/${string}`[] = [
			'img/hug',
			'img/kiss',
			'img/poke',
			'img/tickle',
			'img/pat',
			'img/cuddle',
			'img/punch'
		];
		endpoints.forEach(cmd => {
			const commandName = cmd.slice(4, cmd.length);
			console.log('Loaded command %s', commandName);

			commands.set(commandName, {
				label: commandName,
				options: {
					guildOnly: false,
					adminOnly: false,
					information: {
						descr: `Action: ${commandName}`,
						usage: `[@User]`,
						short: `Action: ${commandName}`
					}
				},
				cooldown: 4,
				execute: session => async msg => {

					const getDescription = (action: string, author: GuildMember | User, member: GuildMember | User) => `${author.toString()} received a ${action} from ${member.toString()}`;
					const url = <string | undefined> (await superagent.get(api + cmd)).body.url;

					if (!url)
						return 'No encontré una imagen para mostrar';

					if (!msg.guild && session.user)
						return new MessageEmbed()
							.setDescription(getDescription(commandName, msg.author, session.user))
							.setColor('RANDOM')
							.setImage(url);

					if (!msg.guild?.me) return; //todo
					if (!msg.member) return;

					const member = msg.mentions.members?.first() ?? msg.guild.me;

					return new MessageEmbed()
						.setDescription(getDescription(commandName, msg.member, member))
						.setColor('RANDOM')
						.setImage(url);
				}
			});
		});
	}

	// handle all events in /events/subfolder/...
	public static handleEvents(folder: string, session: Client, events: Map<string, IEvent>) {
		const path = join(__dirname, folder);
		readdirSync(path).forEach(async file => {
			if (!file.endsWith('.js')) {
				const unknownFile = join(folder, file);
				Main.handleEvents(unknownFile, session, events);
				return;
			}
			const eventFile = join(__dirname, folder, file);
			const event = <IEvent> await import(eventFile);
			session[event.once ? 'once' : 'on'](event.label, (...args: unknown[]) => event.execute(...args));
			events.set(event.label, event);
			console.log('Loaded event %s', event.label);
		});
	}

	// handle all commands in /commands/subfolder/...
	public static handleCommands(folder: string, commands: Map<string, ICommand>, aliases: Map<string, string>) {
		const path = join(__dirname, folder);
		readdirSync(path).forEach(async file => {
			if (!file.endsWith('.js')) {
				const unknownFile = join(folder, file);
				Main.handleCommands(unknownFile, commands, aliases);
				return;
			}
			const commandFile = join(__dirname, folder, file);
			const command = <ICommand> await import(commandFile);

			if (command.options?.disabled) return;

			command.alias?.forEach(alias => aliases.set(alias, command.label));
			commands.set(command.label, command);
			console.log('Loaded command %s', command.label);
		});
	}

	// start the client
	public static session = new Client({
		intents: [
			Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
			Intents.FLAGS.DIRECT_MESSAGES,
			Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
			Intents.FLAGS.GUILD_MESSAGES,
			Intents.FLAGS.GUILDS
		],
		presence: {
			status: 'online',
			activities: [{ name: Options.Prefix, type: Constants.ActivityTypes.LISTENING }]
		}
	});

	// command handler v2
	private static supportGuildId = '891367004903182336';
	private static sessionId = '839719220979695626';

	// ...
	public static slashCommandsData: object[] = [];

	// register
	static {
		// slash command handler
		const folder = '/slash_commands/admin';
		const path = join(__dirname, folder);

		readdirSync(path).filter(file => file.endsWith('.js')).forEach(async file => {
			const commandFile = join(__dirname, folder, file)
			const command = await import(commandFile);
			Main.slashCommandsData.push(command.data.toJSON());
			Main.slashCommands.set(command.data.name, command);
			console.log('Logged slash command %s', command.data.name);
		});
		// end slash command handler
		const rest = new REST({ version: '9' }).setToken(Main.session.token as string);
		(async () => {
			try {
				console.log('Started refreshing application (/) commands.');
				// TODO
				await rest.put(Routes.applicationGuildCommands(
					Main.sessionId, Main.supportGuildId),
					{ body: Main.slashCommandsData }
				);

				await rest.put(
					Routes.applicationCommands(Main.sessionId),
					{ body: Main.slashCommandsData },
				);

				console.log('Successfully reloaded application (/) commands.');
			}
			catch (err: unknown) {
				console.error('Cannot reload application commands %s', err);
			}
		})()
	}

	static {
		// login on the client
		Main.session.login();
		Main.session.on('error', console.error);
		Main.session.on('unhandledPromiseRejection', console.error);
	}

	static {
		// command handler
		Main.handleEvents('/events', Main.session, Main.events);
		Main.handleCommands('/commands', Main.commands, Main.aliases);
		Main.handleApiCommands(Main.commands);
	}
}
export const slashCommands = Main.slashCommands;
export const commands = Main.commands;
export const aliases = Main.aliases;
export const events = Main.events;