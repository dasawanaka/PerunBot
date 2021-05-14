const mongoose = require("mongoose");

const LogChannelSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  channelID: { type: String, required: true },
});

module.exports = mongoose.model("LogChannel", LogChannelSchema, "log_channel");
