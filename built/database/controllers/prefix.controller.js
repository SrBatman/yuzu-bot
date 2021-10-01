"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.edit = exports.add = void 0;
const tslib_1 = require("tslib");
const prefix_model_1 = (0, tslib_1.__importDefault)(require("../models/prefix.model"));
const mongoose_1 = require("mongoose");
async function add({ prefix, server }) {
    const newPrefix = new prefix_model_1.default({
        id: mongoose_1.Types.ObjectId(),
        prefix: prefix,
        server: server
    });
    const output = await newPrefix.save();
    return output;
}
exports.add = add;
async function edit(before, prefix, server) {
    await prefix_model_1.default.updateOne({ before }, { prefix, server });
    const output = await get(server);
    return output;
}
exports.edit = edit;
async function get(server) {
    const output = await prefix_model_1.default.findOne({ server });
    return output;
}
exports.get = get;
