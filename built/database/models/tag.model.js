"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagSchema = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
exports.TagSchema = new mongoose_1.default.Schema({
    id: mongoose_1.default.Schema.Types.ObjectId,
    server: String,
    user: String,
    name: String,
    content: String,
    attachments: [String],
    global: Boolean,
    nsfw: Boolean
});
exports.default = mongoose_1.default.model('Tag', exports.TagSchema);
