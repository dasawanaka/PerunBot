const Levels = require("discord-xp");

module.exports = {
  init: (configFileName) => {
    const { mongodbConf } = require(`../${configFileName}`);

    let port = mongodbConf.port === "0" ? "" : ":" + mongodbConf.port;

    let preUrl = port ===""?"mongodb+srv://": "mongodb://" ;

    var url =
      preUrl +
      mongodbConf.user +
      ":" +
      mongodbConf.pwd +
      "@" +
      mongodbConf.host +
      port +
      "/" +
      mongodbConf.dbName +
      "?retryWrites=true&w=majority";

    Levels.setURL(url);
  },
};
