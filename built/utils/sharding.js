"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shardedChannels = exports.shardedGuilds = exports.shardedUsers = void 0;
const tslib_1 = require("tslib");
function shardedUsers(client) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const entries = yield ((_a = client.shard) === null || _a === void 0 ? void 0 : _a.broadcastEval('client.users.cache.entries()'));
        const output = new Map();
        for (const [entry] of entries) {
            output.set(entry === null || entry === void 0 ? void 0 : entry[0], entry === null || entry === void 0 ? void 0 : entry[1]);
            return output;
        }
        return output;
    });
}
exports.shardedUsers = shardedUsers;
function shardedGuilds(client) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const entries = yield ((_a = client.shard) === null || _a === void 0 ? void 0 : _a.broadcastEval('client.guilds.cache.entries()'));
        const output = new Map();
        for (const [entry] of entries) {
            output.set(entry === null || entry === void 0 ? void 0 : entry[0], entry === null || entry === void 0 ? void 0 : entry[1]);
            return output;
        }
        return output;
    });
}
exports.shardedGuilds = shardedGuilds;
function shardedChannels(client) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const entries = yield ((_a = client.shard) === null || _a === void 0 ? void 0 : _a.broadcastEval('client.channels.cache.entries()'));
        const output = new Map();
        for (const [entry] of entries) {
            output.set(entry === null || entry === void 0 ? void 0 : entry[0], entry === null || entry === void 0 ? void 0 : entry[1]);
            return output;
        }
        return output;
    });
}
exports.shardedChannels = shardedChannels;
