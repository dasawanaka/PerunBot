const Command = require("../../assets/class/Command");
const path = require("path");

class ButtonRoles extends Command {
  constructor() {
    super({
      name: "ButtonRoles",
      alias: ["br", "rr"],
      public: true,
      description: "Weird faces were weird... delete them asap",
      userPermissions: ["MANAGE_GUILD", "MANAGE_ROLES", "MANAGE_EMOJIS"],
      usage: "rr <action>",
    });

    let dirPath = path.join(__dirname, this.name);
    this.init(dirPath);
  }
}

module.exports = ButtonRoles;
