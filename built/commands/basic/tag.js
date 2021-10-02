"use strict";
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const tagController = (0, tslib_1.__importStar)(require("../../database/controllers/tag.controller"));
const options_1 = (0, tslib_1.__importDefault)(require("../../options"));
const OWNERID = options_1.default.owner;
const isArgument = (arg) => arg instanceof String && arg === ('add' || 'set' || 'new' || 'remove' || 'delete' || 'edit' || 'list' || 'nsfw' || 'global' || 'owner');
const command = {
    label: 'tag',
    alias: ['t'],
    options: {
        guildOnly: true,
        adminOnly: false,
        information: {
            descr: 'Crea, edita, borra o modifica tags.',
            short: ':eyes:',
            usage: '[add(name, content) | remove(name) | give(name, @user) | edit(name, content) | list() | nsfw(name) | global(name) | owner(name)] [search] ...'
        }
    },
    execute: () => async (msg, args) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (!msg.guild)
            return;
        const arg = (_a = args === null || args === void 0 ? void 0 : args[0]) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        const obtain = async (content) => { var _a; return await tagController.get(content, (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.id); };
        switch (arg) {
            case 'new':
            case 'set':
            case 'add': {
                if (!(args === null || args === void 0 ? void 0 : args[1])) {
                    msg.channel.send('Por favor debes especificar un nombre para tu tag');
                    return;
                }
                const tag = await obtain(args === null || args === void 0 ? void 0 : args[1]);
                const content = (_b = args === null || args === void 0 ? void 0 : args.slice(2)) === null || _b === void 0 ? void 0 : _b.join(' ');
                if (!tag) {
                    if (!content && msg.attachments.size < 1) {
                        msg.channel.send('Escribe algo, no puedo guardar tags vacíos');
                        return;
                    }
                    const output = await tagController.add(msg.guild.id, msg.author.id, content !== null && content !== void 0 ? content : ' ', args === null || args === void 0 ? void 0 : args[1], msg.attachments.map(att => att.url));
                    msg.channel.send(`Añadí el tag ${output.name}`);
                }
                else {
                    msg.reply('ese tag ya existe');
                    if (tag.global)
                        msg.reply('ese tag es global');
                }
                break;
            }
            case 'delete':
            case 'remove': {
                if (!(args === null || args === void 0 ? void 0 : args[1])) {
                    msg.channel.send('Por favor debes especificar un tag para borrar');
                    return;
                }
                const tag = await obtain(args === null || args === void 0 ? void 0 : args[1]);
                if (tag) {
                    if (tag.user !== msg.author.id || !((_c = msg.member) === null || _c === void 0 ? void 0 : _c.permissions.has(discord_js_1.Permissions.FLAGS.ADMINISTRATOR)) || msg.author.id !== OWNERID) {
                        msg.channel.send('No sos dueño de ese tag');
                        return;
                    }
                    if (tag.global && msg.author.id !== OWNERID) {
                        msg.channel.send('El tag es global y no se puede eliminar');
                        return;
                    }
                    await tagController.remove(msg.guild.id, msg.author.id, args === null || args === void 0 ? void 0 : args[1]);
                    msg.channel.send(`Removí el tag ${args[1]}`);
                }
                break;
            }
            case 'give':
            case 'gift': {
                if (!(args === null || args === void 0 ? void 0 : args[1])) {
                    msg.channel.send('Por favor debes especificar un tag para regalar.');
                    return;
                }
                const tag = await obtain(args === null || args === void 0 ? void 0 : args[1]);
                const target = msg.mentions.users.first();
                if (!target)
                    msg.channel.send('No encontré ese usuario');
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
                if (!(args === null || args === void 0 ? void 0 : args[1])) {
                    msg.channel.send('Por favor debes especificar un tag para editar');
                    return;
                }
                const tag = await obtain(args === null || args === void 0 ? void 0 : args[1]);
                const content = (_e = args === null || args === void 0 ? void 0 : args.slice(2)) === null || _e === void 0 ? void 0 : _e.join(' ');
                if (tag)
                    if (tag.user !== msg.author.id)
                        msg.channel.send('No sos dueño de ese tag');
                    else if (!content && msg.attachments.size < 1)
                        msg.channel.send('Por favor debes especificar el contenido del tag');
                    else {
                        const output = await tagController.edit(tag, {
                            content: content !== null && content !== void 0 ? content : '',
                            attachments: msg.attachments.map(att => att.url)
                        });
                        msg.channel.send(`Edité el tag ${output === null || output === void 0 ? void 0 : output.name}`);
                    }
                else
                    msg.channel.send('No encontré ese tag');
                break;
            }
            case 'list': {
                const tags = await tagController.find(msg.guild.id, (_g = (_f = msg.mentions.users.first()) === null || _f === void 0 ? void 0 : _f.id) !== null && _g !== void 0 ? _g : msg.author.id);
                const list = discord_js_1.Util.splitMessage(`'TAGS': #\n${tags.map(tag => tag.name).join(', ')}`);
                for (const tagsInList of list)
                    msg.channel.send({ content: tagsInList });
                break;
            }
            case 'global': {
                if (!(args === null || args === void 0 ? void 0 : args[1])) {
                    msg.channel.send('Por favor debes especificar un tag para convertir');
                    return;
                }
                const tag = await obtain(args === null || args === void 0 ? void 0 : args[1]);
                if (!(args === null || args === void 0 ? void 0 : args[0]))
                    msg.channel.send('Error inesperado');
                if ((tag === null || tag === void 0 ? void 0 : tag.user) !== OWNERID)
                    msg.channel.send('No sos dueño del bot');
                if (tag)
                    if (!tag.global) {
                        const output = await tagController.edit(tag, {
                            content: tag.content,
                            attachments: msg.attachments.map(att => att.url)
                        }, true, false);
                        msg.channel.send(`Edité el tag ${output === null || output === void 0 ? void 0 : output.name} para que se pueda usar en todos los servidores`);
                    }
                    else {
                        const output = await tagController.edit(tag, {
                            content: tag.content,
                            attachments: msg.attachments.map(att => att.url)
                        }, false, false);
                        msg.channel.send(`Edité el tag ${output === null || output === void 0 ? void 0 : output.name} para que ya no se pueda usar en todos los servidores`);
                    }
                else
                    msg.channel.send('No encontré ese tag');
                break;
            }
            case 'nsfw': {
                if (!(args === null || args === void 0 ? void 0 : args[1])) {
                    msg.channel.send('Por favor debes especificar un tag para convertir');
                    return;
                }
                const tag = await obtain(args === null || args === void 0 ? void 0 : args[1]);
                if (!(args === null || args === void 0 ? void 0 : args[1]))
                    msg.channel.send('Por favor debes especificar el tag que querés volver nsfw');
                if (tag)
                    if (tag.user !== msg.author.id && !((_h = msg.member) === null || _h === void 0 ? void 0 : _h.permissions.has(discord_js_1.Permissions.FLAGS.ADMINISTRATOR)))
                        msg.channel.send('No sos dueño de ese tag');
                    else if (tag.global)
                        msg.channel.send('No se puede mostrar un tag global si es nsfw');
                    else {
                        const output = await tagController.edit(tag, { content: tag.content, attachments: tag.attachments }, false, true);
                        msg.channel.send(`Edité el tag ${output === null || output === void 0 ? void 0 : output.name} para que se pueda usar solo en canales nsfw`);
                    }
                else
                    msg.channel.send('No encontré ese tag');
                break;
            }
            case 'owner': {
                if (!(args === null || args === void 0 ? void 0 : args[1])) {
                    msg.channel.send('Por favor debes especificar un tag');
                    return;
                }
                const tag = await obtain(args === null || args === void 0 ? void 0 : args[1]);
                if (tag)
                    msg.channel.send(`ID: ${tag.user}`);
                else
                    msg.channel.send('No encontré ese tag');
                break;
            }
            default:
                if (!isArgument(arg) && (args === null || args === void 0 ? void 0 : args[0])) {
                    const tagGlobal = await tagController.get(args === null || args === void 0 ? void 0 : args[0]);
                    const tag = await tagController.get(args === null || args === void 0 ? void 0 : args[0], msg.guild.id);
                    if (!tagGlobal) {
                        msg.channel.send('No se ha encontrado el tag');
                        return;
                    }
                    else if (!tag) {
                        msg.channel.send('No se ha encontrado el tag');
                        return;
                    }
                    if ((tag === null || tag === void 0 ? void 0 : tag.nsfw) && !msg.channel.nsfw) {
                        msg.channel.send('Contenido nsfw, lo sentimos pero no se puede mostrar en éste canal :underage:');
                    }
                    else
                        msg.channel.send({ content: tag === null || tag === void 0 ? void 0 : tag.content, files: tag.attachments });
                }
                break;
        }
    }
};
module.exports = command;
