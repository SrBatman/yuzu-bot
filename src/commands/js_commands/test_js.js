var command = {
    label: 'test',
    options: {
        guildOnly: false,
        adminOnly: false,
    },
    execute: () => () => 'tested!'
};
// or
class Command {
	label = 'test';
	options = {
		guildOnly: false,
		adminOnly: false,
	};
	static execute = () => () => 'tested!';
}
Command
export default command;