const mongoose = require("mongoose");

const ReactionRoles = new mongoose.Schema({
  guildID: { type: String },
  channelID: { type: String },
  messageID: { type: String },
  emoji: { type: String},
  roleID: { type: String }
});

module.exports = mongoose.model('ReactionRoles', ReactionRoles, 'reaction_roles');