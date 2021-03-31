"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const tslib_1 = require("tslib");
const options_1 = require("../../options");
const bot_1 = require("../../bot");
require("../../structures/Guild");
require("../../utils/slashCommands");
const cooldowns = new Map();
exports.event = {
    label: 'message',
    execute(session, msg) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield msg.guild.getPrefix();
            const prefix = (res === null || res === void 0 ? void 0 : res.prefix) || options_1.options.prefix;
            const args = msg.content.slice(prefix.length).trim().split(/\s+/gm), name = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase(), command = (_b = bot_1.commands.get(name)) !== null && _b !== void 0 ? _b : bot_1.commands.get(bot_1.aliases.get(name));
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
                if (!cooldowns.has(command.label))
                    cooldowns.set(command.label, new Map());
                var timestamps = cooldowns.get(command.label);
            }
            if (timestamps === null || timestamps === void 0 ? void 0 : timestamps.has((_c = msg.guild) === null || _c === void 0 ? void 0 : _c.id)) {
                const expirationTime = (((_d = command.cooldown) !== null && _d !== void 0 ? _d : 3000) * 1000) + ((_f = timestamps === null || timestamps === void 0 ? void 0 : timestamps.get((_e = msg.guild) === null || _e === void 0 ? void 0 : _e.id)) !== null && _f !== void 0 ? _f : 3000);
                if (Date.now() < expirationTime) {
                    const timeLeft = new Date(expirationTime - Date.now()).getSeconds();
                    msg.channel.send(`estoy re caliente como para poder ejecutar más comandos \\🔥\nEspera **${timeLeft}** antes volver a usar **${command.label}**`);
                    return;
                }
            }
            session.setTimeout(() => { var _a; return timestamps === null || timestamps === void 0 ? void 0 : timestamps.delete((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.id); }, ((_g = command.cooldown) !== null && _g !== void 0 ? _g : 3) * 1000);
            timestamps === null || timestamps === void 0 ? void 0 : timestamps.set((_h = msg.guild) === null || _h === void 0 ? void 0 : _h.id, Date.now());
            const output = yield command.execute(session)(msg, args);
            if (output) {
                const sended = yield msg.channel.send(output);
                console.log('Sended message "%s" of id: %s executed with prefix %s', sended.content, sended.id, prefix);
            }
        });
    }
};
function validateCommandExecution(msg, commandOptions) {
    const { prefix, owner } = options_1.options;
    if (!commandOptions)
        return;
    if (commandOptions.argsRequired && !commandOptions.argsRequired.message)
        return `Uso incorrecto, por favor use ${prefix}help \`<Comando>\` para más información`;
    if (commandOptions.argsRequired && commandOptions.argsRequired.message)
        return commandOptions.argsRequired.message;
    if (commandOptions.guildOnly && !msg.guild)
        return 'Ese comando solo se puede ejecutar dentro de un servidor';
    if (commandOptions.adminOnly && msg.author.id !== owner.id)
        return 'No sos el dueño del bot';
}
