"use strict";
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const typescript_1 = require("typescript");
const util_1 = require("util");
const command = {
    label: 'eval',
    options: {
        guildOnly: true,
        adminOnly: false,
    },
    execute: (session) => (msg, args) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        if (msg.author.id !== '659611986413355018')
            return 'Qué hacés down solo Le Val puede usar eso';
        try {
            if (msg.author.id !== '659611986413355018')
                throw new Error('Qué hacés down solo Le Val puede usar eso.');
        }
        catch (err) {
            if (err instanceof (String || Error || TypeError || RangeError || EvalError))
                msg.channel.send(['Error', err], { code: 'js' });
        }
        finally {
            const entry = args === null || args === void 0 ? void 0 : args.join(' ');
            const exit = util_1.inspect(eval(typescript_1.transpile(entry))).split(session === null || session === void 0 ? void 0 : session.token).join((_a = session === null || session === void 0 ? void 0 : session.token) === null || _a === void 0 ? void 0 : _a.replace(/.(?=.{25,}$)/g, '#'));
            if (exit)
                return new discord_js_1.MessageEmbed()
                    .setAuthor((_c = (_b = msg.member) === null || _b === void 0 ? void 0 : _b.nickname) !== null && _c !== void 0 ? _c : msg.author.username, msg.author.displayAvatarURL())
                    .setColor('RANDOM')
                    .setTitle('Eval')
                    .addField(`Evaluado en:`, `\`\`\`ts\n${session.ws.ping}ms\`\`\``, true)
                    .addField('Entrada :inbox_tray:', `\`\`\`ts\n${entry}\`\`\``, true)
                    .addField('Salida :outbox_tray:', `\`\`\`ts\n${exit}\`\`\``, true)
                    .addField('Tipo :bar_chart:', `\`\`\`ts\n${typeof exit}\`\`\``, true);
            else
                return 'Escribe algo.';
        }
    })
};
module.exports = command;
