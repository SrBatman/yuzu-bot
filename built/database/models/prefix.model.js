"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrefixSchema = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
exports.PrefixSchema = new mongoose_1.default.Schema({
    id: mongoose_1.default.Schema.Types.ObjectId,
    prefix: String,
    server: String,
});
exports.default = mongoose_1.default.model('Prefix', exports.PrefixSchema, 'prefixes');
