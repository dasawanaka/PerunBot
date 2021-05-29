const Command = require("../../assets/class/Command");

class Skip extends Command {
  constructor() {
    super({
      name: "skip",
      alias: ["fs"],
      public: true,
      description: "Skipping? That was the best part!",
      usage: ["<prefix>skip"],
    });
  }
  async run(client, message, args) {
    client.distube.skip(message);
  }
}
module.exports = Skip;
