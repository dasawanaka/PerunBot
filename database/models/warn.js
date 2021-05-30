const mongoose = require("mongoose");

const WarnSchema = new mongoose.Schema({
  warnID: { type: Number, default: 0 },
  userID: { type: String },
  guildID: { type: String },
  reason: { type: String },
  date: { type: Date, default: new Date() },
  moderator: { type: String },
  cleared: { type: Boolean, default: false },
  clearedDate: { type: Date },
  clearedBy: { type: String },
});

module.exports = mongoose.model("Warn", WarnSchema, "warn");
