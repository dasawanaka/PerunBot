const Command = require("../../assets/class/Command");
const path = require("path");

class AutoVoiceChannels extends Command {
  constructor() {
    super({
      name: "autoVoiceChannels",
      alias: ['av'],
      public: false,
      description: "",
      dev: true,
    })
    let dirPath = path.join(__dirname, this.name);
     this.init(dirPath);
  }
}

module.exports = AutoVoiceChannels;
