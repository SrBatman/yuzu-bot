"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.find = exports.get = exports.edit = exports.pass = exports.remove = exports.add = void 0;
const tslib_1 = require("tslib");
const tag_model_1 = tslib_1.__importDefault(require("../models/tag.model"));
const mongoose_1 = require("mongoose");
function add(server, user, content, name, attachments) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return yield newTag.save();
    });
}
exports.add = add;
function remove(server, user, name) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const output = yield tag_model_1.default.findOneAndDelete({ server, user, name });
        return output;
    });
}
exports.remove = remove;
function pass(tag, { server, user }, nsfw = false, global = false) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        const output = tag_model_1.default.findOneAndUpdate(finded, edited, { new: true });
        return output;
    });
}
exports.pass = pass;
function edit(tag, { content, attachments }, global = false, nsfw = false) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        const output = tag_model_1.default.findOneAndUpdate(finded, edited, { new: true });
        return output;
    });
}
exports.edit = edit;
function get(name, server) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const output = (_a = yield tag_model_1.default.findOne({ name: name, global: true })) !== null && _a !== void 0 ? _a : yield tag_model_1.default.findOne({ name, server });
        return output;
    });
}
exports.get = get;
function find(server, user) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const output = yield tag_model_1.default.find({ user, server });
        return output;
    });
}
exports.find = find;
