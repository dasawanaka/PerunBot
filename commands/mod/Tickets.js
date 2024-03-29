const Command = require("../../assets/class/Command");
const path = require("path");

class Tickets extends Command {
  constructor() {
    super({
      name: "tickets",
      alias: [],
      public: false,
      description: "",
      dev: false,
      clientPermissions: ["MANAGE_CHANNELS", "VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "READ_MESSAGE_HISTORY"],
    })
    let dirPath = path.join(__dirname, this.name);
     this.init(dirPath);
  }
}

module.exports = Tickets;
