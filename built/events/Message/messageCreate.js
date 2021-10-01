"use strict";
const tslib_1 = require("tslib");
const options_1 = (0, tslib_1.__importDefault)(require("../../options"));
const bot_1 = require("../../bot");
const discord_js_1 = require("discord.js");
const Controller = (0, tslib_1.__importStar)(require("../../database/controllers/prefix.controller"));
const cooldowns = new Map();
const event = {
    label: 'messageCreate',
    async execute(msg) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        var timestamps;
        const session = msg.client;
        const prefix = msg.guild ? (_b = (_a = (await Controller.get(msg.guild.id))) === null || _a === void 0 ? void 0 : _a.prefix) !== null && _b !== void 0 ? _b : options_1.default.prefix : options_1.default.prefix;
        const args = msg.content.slice(prefix.length).trim().split(/\s+/gm);
        const name = (_c = args.shift()) === null || _c === void 0 ? void 0 : _c.toLowerCase();
        const command = (_d = bot_1.commandFiles.get(name)) !== null && _d !== void 0 ? _d : bot_1.commandFiles.get(bot_1.commandAliases.get(name));
        const error = validateCommandExecution(msg, command === null || command === void 0 ? void 0 : command.options);
        if (!msg.content.startsWith(prefix) || msg.author.bot)
            return;
        else if (!command) {
            msg.channel.send('Ese comando no existe.');
            return;
        }
        else if (error) {
            msg.channel.send(error);
            return;
        }
        else if (command.label) {
            if (!cooldowns.has(command.label))
                cooldowns.set(command.label, new Map());
            timestamps = cooldowns.get(command.label);
        }
        if ((_e = msg.guild) === null || _e === void 0 ? void 0 : _e.id)
            if (timestamps === null || timestamps === void 0 ? void 0 : timestamps.has((_f = msg.guild) === null || _f === void 0 ? void 0 : _f.id)) {
                const expirationTime = ((_g = command.cooldown) !== null && _g !== void 0 ? _g : 3) * 1000 + (timestamps === null || timestamps === void 0 ? void 0 : timestamps.get((_h = msg.guild) === null || _h === void 0 ? void 0 : _h.id));
                if (Date.now() < expirationTime) {
                    const timeLeft = new Date(expirationTime - Date.now()).getSeconds();
                    msg.channel.send(`estoy re caliente como para poder ejecutar más comandos \\🔥\nEspera **${timeLeft}** antes volver a usar **${command.label}**`);
                    return;
                }
            }
        if ((_j = msg.guild) === null || _j === void 0 ? void 0 : _j.id) {
            setTimeout(() => { var _a; return timestamps === null || timestamps === void 0 ? void 0 : timestamps.delete((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.id); }, ((_k = command.cooldown) !== null && _k !== void 0 ? _k : 3) * 1000);
            timestamps === null || timestamps === void 0 ? void 0 : timestamps.set((_l = msg.guild) === null || _l === void 0 ? void 0 : _l.id, Date.now());
        }
        const output = await command.execute(session)(msg, args);
        if (output)
            if (output instanceof discord_js_1.MessageEmbed) {
                const sended = await msg.channel.send({ embeds: [output] });
                console.log('Sended message "%s" of id: %s executed with prefix %s', sended.content, sended.id, prefix);
            }
            else {
                const sended = await msg.channel.send({ content: output });
                console.log('Sended message "%s" of id: %s executed with prefix %s', sended.content, sended.id, prefix);
            }
    }
};
function validateCommandExecution(msg, commandOptions) {
    const { prefix, owner } = options_1.default;
    if (!commandOptions)
        return;
    if (commandOptions.disabled)
        return 'El comando está desactivado';
    else if (commandOptions.argsRequired && !commandOptions.argsRequired.message)
        return `Uso incorrecto, por favor use ${prefix}help \`<Comando>\` para más información`;
    else if (commandOptions.argsRequired && commandOptions.argsRequired.message)
        return commandOptions.argsRequired.message;
    else if (commandOptions.guildOnly && !msg.guild)
        return 'Ese comando solo se puede ejecutar dentro de un servidor';
    else if (commandOptions.adminOnly && msg.author.id !== owner)
        return 'No sos el dueño del bot';
    else
        return undefined;
}
module.exports = event;
