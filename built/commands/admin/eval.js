"use strict";
const discord_js_1 = require("discord.js");
const typescript_1 = require("typescript");
const util_1 = require("util");
const command = {
    label: 'eval',
    options: {
        guildOnly: true,
        adminOnly: false,
    },
    execute: (session) => async (msg, args) => {
        var _a, _b;
        if (msg.author.id !== '790411185970872320')
            return 'Qué hacés down solo Le Val puede usar eso';
        try {
            if (msg.author.id !== '790411185970872320')
                throw new Error('Qué hacés down solo Le Val puede usar eso.');
        }
        catch (err) {
            if (err instanceof (String || Error || TypeError || RangeError || EvalError))
                msg.channel.send({ content: 'Error ' + err });
        }
        finally {
            const entry = args === null || args === void 0 ? void 0 : args.join(' ');
            const exit = (0, util_1.inspect)(eval((0, typescript_1.transpile)(entry)));
            if (exit)
                return new discord_js_1.MessageEmbed()
                    .setAuthor((_b = (_a = msg.member) === null || _a === void 0 ? void 0 : _a.nickname) !== null && _b !== void 0 ? _b : msg.author.username, msg.author.displayAvatarURL())
                    .setColor('RANDOM')
                    .setTitle('Eval')
                    .addField(`Evaluado en:`, `\`\`\`ts\n${session.ws.ping}ms\`\`\``, true)
                    .addField('Entrada :inbox_tray:', `\`\`\`ts\n${entry}\`\`\``, true)
                    .addField('Salida :outbox_tray:', `\`\`\`ts\n${exit}\`\`\``, true)
                    .addField('Tipo :bar_chart:', `\`\`\`ts\n${typeof exit}\`\`\``, true);
            else
                return 'Escribe algo.';
        }
    }
};
module.exports = command;
