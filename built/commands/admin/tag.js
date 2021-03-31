"use strict";
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const tagController = tslib_1.__importStar(require("../../database/controllers/tag.controller"));
var Command;
(function (Command) {
    const OWNERID = '790411185970872320';
    const isArgument = (arg) => (arg instanceof String) && arg === ('add' || 'set' || 'new' || 'remove' || 'delete' || 'edit' || 'list' || 'nsfw' || 'global' || 'merge' || 'owner' || 'origin');
    Command.command = {
        label: 'tag',
        options: {
            guildOnly: true,
            adminOnly: false
        },
        execute: (_session) => (msg, args) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            if (!msg.guild)
                return;
            const arg = (_a = args === null || args === void 0 ? void 0 : args[0]) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            const obtain = (content) => tslib_1.__awaiter(this, void 0, void 0, function* () { var _k; return yield tagController.get(content, (_k = msg.guild) === null || _k === void 0 ? void 0 : _k.id); });
            switch (arg) {
                case 'new':
                case 'set':
                case 'add': {
                    const tag = yield obtain(args === null || args === void 0 ? void 0 : args[1]);
                    const content = (_b = args === null || args === void 0 ? void 0 : args.slice(2)) === null || _b === void 0 ? void 0 : _b.join(' ');
                    if (!(args === null || args === void 0 ? void 0 : args[1])) {
                        msg.channel.send('Por favor debes especificar un nombre para tu tag.');
                    }
                    else if (!tag) {
                        if (!content && msg.attachments.size < 1) {
                            msg.channel.send('Escribe algo, no puedo guardar tags vacíos.');
                            return;
                        }
                        const output = yield tagController.add(msg.guild.id, msg.author.id, content !== null && content !== void 0 ? content : ' ', args === null || args === void 0 ? void 0 : args[1], msg.attachments.map(att => att.url));
                        msg.channel.send(`Añadí el tag ${output.name}`);
                    }
                    else {
                        msg.reply('ese tag ya existe.');
                        if (tag.global)
                            msg.reply('ese tag es global.');
                    }
                    break;
                }
                case 'delete':
                case 'remove': {
                    const tag = yield obtain(args === null || args === void 0 ? void 0 : args[1]);
                    if (!(args === null || args === void 0 ? void 0 : args[1])) {
                        msg.channel.send('Por favor debes especificar un tag para borrar.');
                    }
                    else if (tag) {
                        if ((tag.user !== msg.author.id) || !((_c = msg.member) === null || _c === void 0 ? void 0 : _c.permissions.has('ADMINISTRATOR'))) {
                            if (msg.author.id !== OWNERID) {
                                msg.channel.send('No sos dueño de ese tag');
                                return;
                            }
                        }
                        else if (tag.global && msg.author.id !== OWNERID) {
                            msg.channel.send('El tag es global y no se puede eliminar');
                            return;
                        }
                        yield tagController.remove(msg.guild.id, msg.author.id, args === null || args === void 0 ? void 0 : args[1]);
                        msg.channel.send(`Removí el tag ${args[0]}`);
                        return;
                    }
                    break;
                }
                case 'give':
                case 'gift': {
                    const tag = yield obtain(args === null || args === void 0 ? void 0 : args[1]);
                    const target = msg.mentions.users.first();
                    if (!target) {
                        msg.channel.send('No encontré ese usuario');
                    }
                    else {
                        if (!tag) {
                            msg.channel.send('No encontré el tag');
                            return;
                        }
                        tagController.pass(tag, { server: (_d = msg.guild) === null || _d === void 0 ? void 0 : _d.id, user: target.id }, tag === null || tag === void 0 ? void 0 : tag.nsfw, tag === null || tag === void 0 ? void 0 : tag.global);
                    }
                    break;
                }
                case 'edit': {
                    const tag = yield obtain(args === null || args === void 0 ? void 0 : args[1]);
                    const content = (_e = args === null || args === void 0 ? void 0 : args.slice(2)) === null || _e === void 0 ? void 0 : _e.join(' ');
                    if (!(args === null || args === void 0 ? void 0 : args[1])) {
                        msg.channel.send('Por favor debes especificar un tag para editar.');
                    }
                    else if (tag) {
                        if (tag.user !== msg.author.id) {
                            msg.channel.send('No sos dueño de ese tag');
                        }
                        else if (!content && msg.attachments.size < 1) {
                            msg.channel.send('Por favor debes especificar el contenido del tag.');
                        }
                        else {
                            const output = yield tagController.edit(tag, {
                                content: content !== null && content !== void 0 ? content : '',
                                attachments: msg.attachments.map(att => att.url)
                            });
                            msg.channel.send(`Edité el tag ${output === null || output === void 0 ? void 0 : output.name}`);
                        }
                    }
                    else {
                        msg.channel.send('No encontré ese tag.');
                    }
                    break;
                }
                case 'list': {
                    const tags = yield tagController.find(msg.guild.id, (_g = (_f = msg.mentions.users.first()) === null || _f === void 0 ? void 0 : _f.id) !== null && _g !== void 0 ? _g : msg.author.id);
                    const list = discord_js_1.Util.splitMessage(`'TAGS': #\n${tags.map(tag => tag.name).join(', ')}`);
                    for (const tagsInList of list)
                        msg.channel.send(tagsInList, { code: 'ml' });
                    break;
                }
                case 'global': {
                    const tag = yield obtain(args === null || args === void 0 ? void 0 : args[1]);
                    if (!(args === null || args === void 0 ? void 0 : args[0])) {
                        msg.channel.send('Error inesperado.');
                    }
                    else if ((tag === null || tag === void 0 ? void 0 : tag.user) !== OWNERID) {
                        msg.channel.send('No sos dueño del bot');
                    }
                    else if (tag) {
                        if (!tag.global) {
                            const output = yield tagController.edit(tag, {
                                content: tag.content,
                                attachments: msg.attachments.map(att => att.url)
                            }, true, false);
                            msg.channel.send(`Edité el tag ${output === null || output === void 0 ? void 0 : output.name} para que se pueda usar en todos los servidores.`);
                        }
                        else {
                            const output = yield tagController.edit(tag, {
                                content: tag.content,
                                attachments: msg.attachments.map(att => att.url)
                            }, false, false);
                            msg.channel.send(`Edité el tag ${output === null || output === void 0 ? void 0 : output.name} para que ya no se pueda usar en todos los servidores.`);
                        }
                    }
                    else {
                        msg.channel.send('No encontré ese tag.');
                    }
                    break;
                }
                case 'nsfw': {
                    const tag = yield obtain(args === null || args === void 0 ? void 0 : args[1]);
                    if (!(args === null || args === void 0 ? void 0 : args[1])) {
                        msg.channel.send('Por favor debes especificar el tag que querés volver nsfw.');
                    }
                    else if (tag) {
                        if (tag.user !== msg.author.id && !((_h = msg.member) === null || _h === void 0 ? void 0 : _h.permissions.has('ADMINISTRATOR'))) {
                            msg.channel.send('No sos dueño de ese tag');
                        }
                        else if (tag.global) {
                            msg.channel.send('No se puede mostrar un tag global si es nsfw.');
                        }
                        else {
                            const output = yield tagController.edit(tag, { content: tag.content, attachments: tag.attachments }, false, true);
                            msg.channel.send(`Edité el tag ${output === null || output === void 0 ? void 0 : output.name} para que se pueda usar solo en canales nsfw.`);
                        }
                    }
                    else {
                        msg.channel.send('No encontré ese tag.');
                    }
                    break;
                }
                case 'owner': {
                    const tag = yield obtain(args === null || args === void 0 ? void 0 : args[1]);
                    if (!(args === null || args === void 0 ? void 0 : args[1])) {
                        msg.channel.send('Por favor debes especificar el tag del que querés saber.');
                    }
                    else if (tag) {
                        msg.channel.send(`ID: ${tag.user}`);
                    }
                    else {
                        msg.channel.send('No encontré ese tag.');
                    }
                    break;
                }
                default: {
                    const tag = yield tagController.get(args === null || args === void 0 ? void 0 : args[0], msg.guild.id);
                    if (!isArgument(arg)) {
                        if (!tag) {
                            msg.channel.send('No se ha encontrado el tag.');
                        }
                        else if ((tag === null || tag === void 0 ? void 0 : tag.nsfw) && !msg.channel.nsfw) {
                            msg.channel.send('Contenido nsfw, lo sentimos pero no se puede mostrar en éste canal :underage:');
                        }
                        else {
                            if ((tag === null || tag === void 0 ? void 0 : tag.global) && (tag === null || tag === void 0 ? void 0 : tag.nsfw))
                                msg.channel.send('Ha habido un fallo en el sistema.');
                            msg.channel.send([(_j = !(tag === null || tag === void 0 ? void 0 : tag.global)) !== null && _j !== void 0 ? _j : '`Global:`\n', tag === null || tag === void 0 ? void 0 : tag.content], { files: tag.attachments });
                        }
                    }
                    break;
                }
            }
        })
    };
})(Command || (Command = {}));
module.exports = Command.command;
