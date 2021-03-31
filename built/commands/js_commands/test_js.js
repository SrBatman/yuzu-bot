"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var command = {
    label: 'test',
    options: {
        guildOnly: false,
        adminOnly: false,
    },
    execute: () => () => 'tested!'
};
class Command {
    constructor() {
        this.label = 'test';
        this.options = {
            guildOnly: false,
            adminOnly: false,
        };
    }
}
Command.execute = () => () => 'tested!';
Command;
exports.default = command;
