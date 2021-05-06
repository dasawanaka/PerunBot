const mongoose = require('mongoose');
const { mongodbConf } = require('../config.json');

module.exports = {
    init: () => {
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 500,
            poolSize: 10,
            connectTimeoutMS: 10000,
            family:4
        };

        var url = 'mongodb://' + mongodbConf.user + ':' + mongodbConf.pwd + '@'
                + mongodbConf.host + ':' + mongodbConf.port + '/' + mongodbConf.dbName;

        mongoose.connect(url, dbOptions);
        mongoose.set('useFindAndModify', false);
        mongoose.Promise = global.Promise;

        mongoose.connection.on('connected', () => {
            console.log('Mongoose has successfully connected!');
        });

        mongoose.connection.on('err', err => {
            console.error(`Mongoose connection error: \n${err.stack}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('Mongoose connection lost');
        });
    }
}