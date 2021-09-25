"use strict";
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const path_1 = require("path");
module.exports = function handleCommands(dir, commands, aliases) {
    (0, fs_1.readdirSync)((0, path_1.join)(__dirname, dir)).forEach((file) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        var _a;
        if (!file.endsWith('.js')) {
            handleCommands((0, path_1.join)(dir, file), commands, aliases);
            return;
        }
        const command = yield Promise.resolve().then(() => (0, tslib_1.__importStar)(require((0, path_1.join)(__dirname, dir, file))));
        if (!command.label)
            command.label = file;
        (_a = command.alias) === null || _a === void 0 ? void 0 : _a.forEach(alias => aliases.set(alias, command.label));
        commands.set(command.label, command);
        console.log('Command %s loaded', command.label);
    }));
};
