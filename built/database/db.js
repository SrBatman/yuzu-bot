"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
let database = undefined;
if (!database) {
    (0, mongoose_1.connect)((_a = process.env.DB) !== null && _a !== void 0 ? _a : 'mongodb://localhost:27017/test', {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        reconnectTries: 10,
        reconnectInterval: 1500,
        connectTimeoutMS: 3000,
        socketTimeoutMS: 30000,
        keepAlive: true
    });
    database = mongoose_1.connection;
    database.on('open', console.info);
    database.on('error', console.error);
}
else
    (0, mongoose_1.disconnect)();
console.info('\x1b[35m%s\x1b[0m', 'trying to connect to the database...');
