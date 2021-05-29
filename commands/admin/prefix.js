const path = require("path");
const Command = require("../../assets/class/Command");

class Prefix extends Command {
  constructor() {
    super({
      name: "prefix",
      alias: [],
      public: true,
      description: "Set new prefix command",
      userPermissions: ["MANAGE_GUILD"],
      usage: [`\`prefix [set | reset] [args..]\``],
      cooldown: 5000,
    });
    let dirPath = path.join(__dirname, this.name);
    this.init(dirPath);
  }
}
module.exports = Prefix;
