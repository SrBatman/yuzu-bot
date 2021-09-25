"use strict";
const tslib_1 = require("tslib");
const base_1 = require("../base");
let cmd = class cmd {
    constructor() {
        this.execute = (_session) => {
            return (_msg, _args) => 'Pong!';
        };
    }
};
cmd = (0, tslib_1.__decorate)([
    (0, base_1.command)('ping')
], cmd);
module.exports = cmd;
