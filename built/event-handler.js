"use strict";
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const path_1 = require("path");
module.exports = function handleEvents(dir, s, events) {
    fs_1.readdirSync(path_1.join(__dirname, dir)).forEach((file) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!file.endsWith('.js')) {
            handleEvents(path_1.join(dir, file), s, events);
            return;
        }
        const { event } = yield Promise.resolve().then(() => tslib_1.__importStar(require(path_1.join(__dirname, dir, file))));
        s.on(event.label, event.execute.bind(undefined, s));
        events.set(event.label, event);
        console.log('Event %s loaded!', event.label);
    }));
};
