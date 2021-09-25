import { connection, connect, disconnect, Connection } from 'mongoose';

let database: Connection | undefined = undefined;

if (!database) {
    connect(process.env.DB!, {
        // keeping alive the host :(
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        reconnectTries: 10,
        reconnectInterval: 1500,
        connectTimeoutMS: 3000,
        socketTimeoutMS: 30000,
        keepAlive: true
    });
    database = connection;
    database.on('open', console.info);
    database.on('error', console.error);
}
else {
    disconnect();
}
console.info('trying to connect to the database...');