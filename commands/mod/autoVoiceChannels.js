const Command = require("../../assets/class/Command");
const path = require("path");

class AutoVoiceChannels extends Command {
  constructor() {
    super({
      name: "autoVoiceChannels",
      alias: ['av'],
      public: false,
      description: "",
      clientPermissions: ["MANAGE_CHANNELS", "VIEW_CHANNEL", "MOVE_MEMBERS"],
      dev: false,
    })
    let dirPath = path.join(__dirname, this.name);
     this.init(dirPath);
  }
}

module.exports = AutoVoiceChannels;
