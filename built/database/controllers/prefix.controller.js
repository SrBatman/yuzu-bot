"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.edit = exports.add = void 0;
const tslib_1 = require("tslib");
const prefix_model_1 = (0, tslib_1.__importDefault)(require("../models/prefix.model"));
const mongoose_1 = require("mongoose");
function add({ prefix, server }) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const newPrefix = new prefix_model_1.default({
            id: mongoose_1.Types.ObjectId(),
            prefix: prefix,
            server: server
        });
        return yield newPrefix.save();
    });
}
exports.add = add;
;
function edit(before, prefix, server) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        yield prefix_model_1.default.updateOne({ before }, { prefix, server });
        return yield get(server);
    });
}
exports.edit = edit;
;
function get(server) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const output = yield prefix_model_1.default.findOne({ server });
        return output;
    });
}
exports.get = get;
;
