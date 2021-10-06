"use strict";
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const Controller = (0, tslib_1.__importStar)(require("../../database/controllers/prefix.controller"));
const options_1 = (0, tslib_1.__importDefault)(require("../../options"));
async function addPrefix(content, guild) {
    const output = await Controller.add({ prefix: content, server: guild.id });
    return output;
}
async function getPrefix(guild) {
    const output = await Controller.get(guild.id);
    return output;
}
async function editPrefix(prefix, guild) {
    const toUpdate = await getPrefix(guild);
    if (toUpdate) {
        const output = await Controller.edit(toUpdate, prefix, guild.id);
        return output;
    }
    return null;
}
const command = {
    label: 'prefix',
    alias: ['setprefix'],
    options: {
        guildOnly: true,
        adminOnly: false,
        information: {
            descr: 'Establece u edita el prefijo del servidor.',
            short: 'Configurar prefijos.',
            usage: '[prefix]'
        }
    },
    execute: () => async (msg, args) => {
        var _a;
        if (args[1])
            return 'No soportamos prefijos multi-línea, ¡lo sentimos!';
        if (!msg.guild)
            return;
        const prefix = args[0];
        const customPrefix = await getPrefix(msg.guild);
        if (!prefix && (customPrefix === null || customPrefix === void 0 ? void 0 : customPrefix.prefix))
            return `El prefix es **${customPrefix === null || customPrefix === void 0 ? void 0 : customPrefix.prefix}**`;
        if (!prefix)
            return `El prefix no ha sido cambiado aún así que es **${options_1.default.Prefix}**`;
        if (!msg.guild)
            return 'No encontré los datos del servidor, ¿Probaste en ejecutar el comando dentro de un servidor?';
        if (!((_a = msg.member) === null || _a === void 0 ? void 0 : _a.permissions.has(discord_js_1.Permissions.FLAGS.ADMINISTRATOR)))
            return 'No tenés permisos de administrador (necesarios para cambiar el prefix)';
        if (!customPrefix || !customPrefix.prefix || customPrefix.prefix === options_1.default.Prefix) {
            const newPrefix = await addPrefix(prefix, msg.guild);
            return `El nuevo prefix será **${newPrefix.prefix}**`;
        }
        else {
            await editPrefix(prefix, msg.guild);
            return `Actualicé el prefix de **${customPrefix === null || customPrefix === void 0 ? void 0 : customPrefix.prefix}** a **${prefix}**`;
        }
    }
};
module.exports = command;
