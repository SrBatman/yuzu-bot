"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
exports.event = {
    label: 'ready',
    execute(session) {
        var _a;
        console.log('Logged in as %s', (_a = session.user) === null || _a === void 0 ? void 0 : _a.username);
        return;
    }
};
