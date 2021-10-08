"use strict";
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const bot_1 = require("../../bot");
const options_1 = (0, tslib_1.__importDefault)(require("../../options"));
const Controller = (0, tslib_1.__importStar)(require("../../database/controllers/prefix.controller"));
const cooldowns = new Map;
const event = {
    label: 'messageCreate',
    async execute(msg) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const session = msg.client;
        const prefix = await getPrefix(options_1.default.Prefix, msg.guild);
        const args = msg.content.slice(prefix.length).trim().split(/\s+/gm);
        const cmdName = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        const command = (_b = bot_1.commands.get(cmdName)) !== null && _b !== void 0 ? _b : bot_1.commands.get(bot_1.aliases.get(cmdName));
        const problem = await validateCommandExecution(msg, options_1.default.Owner, command === null || command === void 0 ? void 0 : command.options);
        const mention = new RegExp(`^<@!?${(_c = session.user) === null || _c === void 0 ? void 0 : _c.id}>( |)$`);
        if (msg.content.match(mention)) {
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
        if (problem) {
            msg.channel.send(problem);
            return;
        }
        let timestamps;
        if (!cooldowns.has(command.label))
            cooldowns.set(command.label, new Map());
        timestamps = cooldowns.get(command.label);
        if (msg.guild) {
            if (timestamps === null || timestamps === void 0 ? void 0 : timestamps.has(msg.guild.id)) {
                const expirationTime = ((_d = command.cooldown) !== null && _d !== void 0 ? _d : 3) * 1000 + (timestamps === null || timestamps === void 0 ? void 0 : timestamps.get(msg.guild.id));
                if (Date.now() < expirationTime) {
                    const timeLeft = new Date(expirationTime - Date.now()).getSeconds();
                    msg.reply(`Estoy re caliente como para poder ejecutar más comandos \\🔥\nEspera **${timeLeft}** antes volver a usar **${command.label}**`);
                    return;
                }
            }
            setTimeout(() => { var _a; return timestamps === null || timestamps === void 0 ? void 0 : timestamps.delete((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.id); }, ((_e = command.cooldown) !== null && _e !== void 0 ? _e : 3) * 1000);
            timestamps === null || timestamps === void 0 ? void 0 : timestamps.set(msg.guild.id, Date.now());
        }
        try {
            const output = await command.execute(session)(msg, args);
            if (output) {
                if (!((_g = (_f = msg.guild) === null || _f === void 0 ? void 0 : _f.me) === null || _g === void 0 ? void 0 : _g.permissions.has(discord_js_1.Permissions.FLAGS.SEND_MESSAGES)))
                    return;
                if (output instanceof discord_js_1.MessageEmbed) {
                    const sended = await msg.channel.send({ embeds: [output] });
                    console.log('Sended message "%s" of id: %s executed with prefix %s', (_h = sended.embeds[0]) === null || _h === void 0 ? void 0 : _h.description, sended.id, prefix);
                }
                else {
                    const sended = await msg.channel.send(output);
                    console.log('Sended message "%s" of id: %s executed with prefix %s', sended.content, sended.id, prefix);
                }
            }
        }
        catch (err) {
            console.error(err);
        }
    }
};
function validateCommandExecution(msg, botOwnerId, commandOptions) {
    if (!commandOptions)
        return;
    if (commandOptions.disabled)
        return 'El comando está desactivado';
    else if (commandOptions.guildOnly && !msg.guild)
        return 'Ese comando solo se puede ejecutar dentro de un servidor';
    else if (commandOptions.adminOnly && msg.author.id !== botOwnerId)
        return 'No sos el dueño del bot';
    else
        return undefined;
}
async function getPrefix(defaultPrefix, guild) {
    if (guild) {
        const output = await Controller.get(guild.id);
        if (!output)
            return defaultPrefix;
        return output.prefix;
    }
    return defaultPrefix;
}
module.exports = event;
