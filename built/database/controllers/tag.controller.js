"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.find = exports.get = exports.edit = exports.pass = exports.remove = exports.add = void 0;
const tslib_1 = require("tslib");
const tag_model_1 = (0, tslib_1.__importDefault)(require("../models/tag.model"));
const mongoose_1 = require("mongoose");
async function add(server, user, content, name, attachments) {
    const newTag = new tag_model_1.default({
        id: mongoose_1.Types.ObjectId(),
        server: server,
        user: user,
        name: name,
        content: content,
        attachments: attachments,
        global: false,
        nsfw: false
    });
    const output = await newTag.save();
    return output;
}
exports.add = add;
async function remove(server, user, name) {
    const output = await tag_model_1.default.findOneAndDelete({ server, user, name });
    return output;
}
exports.remove = remove;
async function pass(tag, { server, user }, nsfw = false, global = false) {
    const finded = {
        server: tag.server,
        user: tag.user,
        name: tag.name
    };
    const edited = {
        server: server,
        user: user,
        global: global,
        nsfw: nsfw
    };
    const output = await tag_model_1.default.findOneAndUpdate(finded, edited, { new: true });
    return output;
}
exports.pass = pass;
async function edit(tag, { content, attachments }, global = false, nsfw = false) {
    const finded = {
        server: tag.server,
        user: tag.user,
        name: tag.name
    };
    const edited = {
        content: content,
        attachments: attachments,
        global: global,
        nsfw: nsfw
    };
    const output = await tag_model_1.default.findOneAndUpdate(finded, edited, { new: true });
    return output;
}
exports.edit = edit;
async function get(name, server) {
    var _a;
    const output = (_a = await tag_model_1.default.findOne({ name: name, global: true })) !== null && _a !== void 0 ? _a : await tag_model_1.default.findOne({ name, server });
    return output;
}
exports.get = get;
async function find(server, user) {
    const output = await tag_model_1.default.find({ user, server });
    return output;
}
exports.find = find;
