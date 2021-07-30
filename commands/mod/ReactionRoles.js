const Command = require("../../assets/class/Command");
const path = require("path");

class ButtonRoles extends Command {
  constructor() {
    super({
      name: "ReactionRoles",
      alias: ["rr"],
      public: true,
      description: "Reaction roles module",
      userPermissions: ["MANAGE_ROLES", "MANAGE_EMOJIS"],
      usage: "rr <action>",
    });

    let dirPath = path.join(__dirname, this.name);
    this.init(dirPath);
  }
}

module.exports = ButtonRoles;
