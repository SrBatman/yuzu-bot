"use strict";
const event = {
    label: 'ready',
    execute(session) {
        var _a;
        console.log('\x1b[36m%s\x1b[0m', `Logged in as ${(_a = session.user) === null || _a === void 0 ? void 0 : _a.username}`);
        console.log(`[MEMORY] ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`);
    },
    once: true
};
module.exports = event;
