const mongoose = require("mongoose");

const ButtonRoles = new mongoose.Schema({
  guildID: { type: String },
  channelID: { type: String },
  messageID: { type: String },
  roleID: { type: String }
});

module.exports = mongoose.model('ButtonRoles', ButtonRoles, 'button_roles');