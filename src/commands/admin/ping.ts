import type { ICommand } from '../../typing/command.d';
const command: ICommand = {
	label: 'ping',
	alias: [],
	options: {
		guildOnly: false,
		adminOnly: false,
		information: {
			descr: 'Ping',
			short: 'Ping',
			usage: ''
		}
	},
	execute: (session) => () => `ping! 🏓 ${Math.floor(session.ws.ping)}ms`
};
export = command;