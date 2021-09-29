"use strict";
const tslib_1 = require("tslib");
const options_1 = require("../../options");
require("../../structures/Guild");
const command = {
    label: 'prefix',
    alias: ['setprefix'],
    options: {
        guildOnly: true,
        adminOnly: false,
    },
    execute: () => (msg, args) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        var _a;
        if (args[1])
            return 'No soportamos prefijos multi-línea, ¡lo sentimos!';
        const guild = msg.guild;
        const prefix = args[0];
        const customPrefix = yield guild.getPrefix();
        if (!prefix && (customPrefix === null || customPrefix === void 0 ? void 0 : customPrefix.prefix))
            return `El prefix es **${customPrefix === null || customPrefix === void 0 ? void 0 : customPrefix.prefix}**`;
        if (!prefix)
            return `El prefix no ha sido cambiado aún así que es **${options_1.options.prefix}**`;
        if (!guild)
            return 'No encontré los datos del servidor, ¿Probaste en ejecutar el comando dentro de un servidor?';
        if (!((_a = msg.member) === null || _a === void 0 ? void 0 : _a.permissions.has('ADMINISTRATOR')))
            return 'No tenés permisos para hacer eso, down.';
        if (!customPrefix || !customPrefix.prefix || customPrefix.prefix === options_1.options.prefix) {
            const newPrefix = yield guild.addPrefix(prefix);
            return `El nuevo prefix será **${newPrefix.prefix}**`;
        }
        else {
            yield guild.editPrefix(prefix);
            return `Actualicé el prefix de **${customPrefix === null || customPrefix === void 0 ? void 0 : customPrefix.prefix}** a **${prefix}**`;
        }
    })
};
module.exports = command;
