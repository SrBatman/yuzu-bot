"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
function command(label, alias, cooldown = 3, options) {
    return (command) => {
        command.label = label;
        command.cooldown = cooldown;
        command.alias = alias;
        command.options = options;
    };
}
exports.command = command;
;
