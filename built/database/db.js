"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
var database = undefined;
if (!database) {
    (0, mongoose_1.connect)(process.env.DB, {
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
else {
    (0, mongoose_1.disconnect)();
}
console.info('\x1b[35m%s\x1b[0m', 'trying to connect to the database...');
