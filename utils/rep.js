const { mongodbConf } = require('../config.json');
const Reputation = require("../class/reputation.js");

module.exports = {
    init: () => {

        var url = 'mongodb://' + mongodbConf.user + ':' + mongodbConf.pwd + '@'
            + mongodbConf.host + ':' + mongodbConf.port + '/' + mongodbConf.dbName;

        Reputation.setURL(url);

    }
}