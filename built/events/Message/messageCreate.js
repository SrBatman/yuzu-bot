"use strict";
const tslib_1 = require("tslib");
const options_1 = require("../../options");
const bot_1 = require("../../bot");
const discord_js_1 = require("discord.js");
const Controller = (0, tslib_1.__importStar)(require("../../database/controllers/prefix.controller"));
const cooldowns = new Map();
const event = {
    label: 'messageCreate',
    async execute(msg) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const session = msg.client;
        const prefix = msg.guild
            ? (_b = (_a = (await Controller.get(msg.guild.id))) === null || _a === void 0 ? void 0 : _a.prefix) !== null && _b !== void 0 ? _b : options_1.options.prefix
            : options_1.options.prefix;
        const args = msg.content.slice(prefix.length).trim().split(/\s+/gm), name = (_c = args.shift()) === null || _c === void 0 ? void 0 : _c.toLowerCase(), command = (_d = bot_1.commands.get(name)) !== null && _d !== void 0 ? _d : bot_1.commands.get(bot_1.aliases.get(name));
        const error = validateCommandExecution(msg, command === null || command === void 0 ? void 0 : command.options);
        if (!msg.content.startsWith(prefix) || msg.author.bot) {
            return;
        }
        else if (!command) {
            msg.channel.send('Ese comando no existe.');
            return;
        }
        else if (error) {
            msg.channel.send(error);
            return;
        }
        else {
            if (!!command.label) {
                if (!cooldowns.has(command.label))
                    cooldowns.set(command.label, new Map());
                var timestamps = cooldowns.get(command.label);
            }
        }
        if (timestamps === null || timestamps === void 0 ? void 0 : timestamps.has((_e = msg.guild) === null || _e === void 0 ? void 0 : _e.id)) {
            const expirationTime = (((_f = command.cooldown) !== null && _f !== void 0 ? _f : 3000) * 1000) + ((_h = timestamps === null || timestamps === void 0 ? void 0 : timestamps.get((_g = msg.guild) === null || _g === void 0 ? void 0 : _g.id)) !== null && _h !== void 0 ? _h : 3000);
            if (Date.now() < expirationTime) {
                const timeLeft = new Date(expirationTime - Date.now()).getSeconds();
                console.log(expirationTime);
                msg.channel.send(`estoy re caliente como para poder ejecutar más comandos \\🔥\nEspera **${timeLeft}** antes volver a usar **${command.label}**`);
                return;
            }
        }
        setTimeout(() => { var _a; return timestamps === null || timestamps === void 0 ? void 0 : timestamps.delete((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.id); }, ((_j = command.cooldown) !== null && _j !== void 0 ? _j : 3) * 1000);
        timestamps === null || timestamps === void 0 ? void 0 : timestamps.set((_k = msg.guild) === null || _k === void 0 ? void 0 : _k.id, Date.now());
        const output = await command.execute(session)(msg, args);
        if (output) {
            if (output instanceof discord_js_1.MessageEmbed) {
                const sended = await msg.channel.send({ embeds: [output] });
                console.log('Sended message "%s" of id: %s executed with prefix %s', sended.content, sended.id, prefix);
            }
            else {
                const sended = await msg.channel.send({ content: output });
                console.log('Sended message "%s" of id: %s executed with prefix %s', sended.content, sended.id, prefix);
            }
        }
    }
};
function validateCommandExecution(msg, commandOptions) {
    const { prefix, owner } = options_1.options;
    if (!commandOptions)
        return;
    if (commandOptions.disabled)
        return 'El comando está desactivado';
    if (commandOptions.argsRequired && !commandOptions.argsRequired.message)
        return `Uso incorrecto, por favor use ${prefix}help \`<Comando>\` para más información`;
    if (commandOptions.argsRequired && commandOptions.argsRequired.message)
        return commandOptions.argsRequired.message;
    if (commandOptions.guildOnly && !msg.guild)
        return 'Ese comando solo se puede ejecutar dentro de un servidor';
    if (commandOptions.adminOnly && msg.author.id !== owner)
        return 'No sos el dueño del bot';
}
module.exports = event;
