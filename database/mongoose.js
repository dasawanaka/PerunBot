const mongoose = require("mongoose");
const logger = require("../DefaultLogger").get();

module.exports = {
  init: (configFileName) => {
    const dbOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 500,
      poolSize: 10,
      connectTimeoutMS: 10000,
      family: 4,
    };

    const { mongodbConf } = require(`../${configFileName}`);

    let port = mongodbConf.port === "0" ? "" : ":" + mongodbConf.port;

    let preUrl = port === "" ? "mongodb+srv://" : "mongodb://";

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

    mongoose.connect(url, dbOptions);
    mongoose.set("useFindAndModify", false);
    mongoose.Promise = global.Promise;

    mongoose.connection.on("connected", () => {
      logger.debug("Mongoose has successfully connected!");
    });

    mongoose.connection.on("err", (err) => {
      logger.error(`Mongoose connection error: \n${err.stack}`);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("Mongoose connection lost");
    });
  },
};
