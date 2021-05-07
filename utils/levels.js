const { mongodbConf } = require('../config.json');
const Levels = require("discord-xp");

module.exports = {
    init: () => {

        var url = 'mongodb://' + mongodbConf.user + ':' + mongodbConf.pwd + '@'
            + mongodbConf.host + ':' + mongodbConf.port + '/' + mongodbConf.dbName;

        Levels.setURL(url);

    }
}