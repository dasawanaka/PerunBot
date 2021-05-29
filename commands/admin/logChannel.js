const path = require("path");
const Command = require("../../assets/class/Command");

class LogChannel extends Command {
  constructor() {
    super({
      name: "logchannel",
      alias: ["lgc"],
      public: true,
      description: "Log channel commands (set | remove)",
      userPermissions: ["MANAGE_GUILD"],
      usage: ["logchannel <set | remove>"],
      cooldown: 5000,
      hasSubCommands: true,
    });
     let dirPath = path.join(__dirname, this.name);
     this.init(dirPath);
  }
}

module.exports = LogChannel;
