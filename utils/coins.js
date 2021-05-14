const { mongodbConf } = require('../config.json');
const Coins = require("../class/coins.js");

module.exports = {
    init: () => {

        var url = 'mongodb://' + mongodbConf.user + ':' + mongodbConf.pwd + '@'
            + mongodbConf.host + ':' + mongodbConf.port + '/' + mongodbConf.dbName;

        Coins.setURL(url);

    }
}