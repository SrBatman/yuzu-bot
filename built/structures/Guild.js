"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const options_1 = require("../options");
const Controller = (0, tslib_1.__importStar)(require("../database/controllers/prefix.controller"));
exports.default = discord_js_1.Structures.extend('Guild', Base => {
    return class extends Base {
        constructor(client, data) {
            super(client, data);
            this.prefix = options_1.options.prefix;
            return this;
        }
        addPrefix(content) {
            return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
                const output = yield Controller.add({ prefix: content, server: this.id });
                this.prefix = output.prefix;
                return output;
            });
        }
        getPrefix() {
            return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
                const output = yield Controller.get(this.id);
                if (output)
                    this.prefix = output.prefix;
                return output !== null && output !== void 0 ? output : { prefix: this.prefix, server: this.id };
            });
        }
        editPrefix(prefix) {
            var _a;
            return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
                const toUpdate = yield this.getPrefix();
                if (toUpdate) {
                    const output = yield Controller.edit(toUpdate, prefix, this.id);
                    this.prefix = (_a = output === null || output === void 0 ? void 0 : output.prefix) !== null && _a !== void 0 ? _a : this.prefix;
                    return output;
                }
                return null;
            });
        }
    };
});
