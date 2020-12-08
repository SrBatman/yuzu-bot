export const command = {
    label: 'test',
    options: {
        guildOnly: false,
        adminOnly: false,
    },
    execute: () => () => 'tested!'
};
// or
export class Command {
	label = 'test';
	options = {
		guildOnly: false,
		adminOnly: false,
	};
	static execute = () => () => 'tested!';
}