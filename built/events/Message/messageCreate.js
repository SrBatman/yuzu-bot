"use strict";
const tslib_1 = require("tslib");
const bot_1 = require("../../bot");
const discord_js_1 = require("discord.js");
const Controller = (0, tslib_1.__importStar)(require("../../database/controllers/prefix.controller"));
const options_1 = (0, tslib_1.__importDefault)(require("../../options"));
const cooldowns = new Map();
const event = {
    label: 'messageCreate',
    async execute(msg) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var timestamps;
        const session = msg.client;
        const prefix = msg.guild ? (_b = (_a = (await Controller.get(msg.guild.id))) === null || _a === void 0 ? void 0 : _a.prefix) !== null && _b !== void 0 ? _b : options_1.default.prefix : options_1.default.prefix;
        const args = msg.content.slice(prefix.length).trim().split(/\s+/gm);
        const name = (_c = args.shift()) === null || _c === void 0 ? void 0 : _c.toLowerCase();
        const command = (_d = bot_1.commandFiles.get(name)) !== null && _d !== void 0 ? _d : bot_1.commandFiles.get(bot_1.commandAliases.get(name));
        const error = validateCommandExecution(msg, command === null || command === void 0 ? void 0 : command.options);
        const regMention = new RegExp(`^<@!?${(_e = session.user) === null || _e === void 0 ? void 0 : _e.id}>( |)$`);
        if (msg.content.match(regMention)) {
            msg.channel.send(`Mi prefix es ${prefix}`);
            return;
        }
        if (msg.author.bot)
            return;
        if (!msg.content.startsWith(prefix))
            return;
        if (!command) {
            msg.channel.send('Ese comando no existe \\🔒');
            return;
        }
        if (error) {
            msg.channel.send(error);
            return;
        }
        if (command.label) {
            if (!cooldowns.has(command.label))
                cooldowns.set(command.label, new Map());
            timestamps = cooldowns.get(command.label);
        }
        if ((_f = msg.guild) === null || _f === void 0 ? void 0 : _f.id)
            if (timestamps === null || timestamps === void 0 ? void 0 : timestamps.has((_g = msg.guild) === null || _g === void 0 ? void 0 : _g.id)) {
                const expirationTime = ((_h = command.cooldown) !== null && _h !== void 0 ? _h : 3) * 1000 + (timestamps === null || timestamps === void 0 ? void 0 : timestamps.get((_j = msg.guild) === null || _j === void 0 ? void 0 : _j.id));
                if (Date.now() < expirationTime) {
                    const timeLeft = new Date(expirationTime - Date.now()).getSeconds();
                    msg.channel.send(`estoy re caliente como para poder ejecutar más comandos \\🔥\nEspera **${timeLeft}** antes volver a usar **${command.label}**`);
                    return;
                }
            }
        if (msg.guild) {
            setTimeout(() => { var _a; return timestamps === null || timestamps === void 0 ? void 0 : timestamps.delete((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.id); }, ((_k = command.cooldown) !== null && _k !== void 0 ? _k : 3) * 1000);
            timestamps === null || timestamps === void 0 ? void 0 : timestamps.set(msg.guild.id, Date.now());
        }
        const output = await command.execute(session)(msg, args);
        if (output)
            if (output instanceof discord_js_1.MessageEmbed) {
                const sended = await msg.channel.send({ embeds: [output] });
                console.log('Sended message "%s" of id: %s executed with prefix %s', sended.content, sended.id, prefix);
            }
            else {
                const sended = await msg.channel.send(output);
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
