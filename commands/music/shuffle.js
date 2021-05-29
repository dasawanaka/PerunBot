const Command = require("../../assets/class/Command");

class Shuffle extends Command {
  constructor() {
    super({
      name: "shuffle",
      alias: ["random"],
      public: true,
      description: "Woogie Booogie!",
      usage: ["<prefix>shuffle"],
    });
  }
  async run(client, message, args) {
    client.distube.shuffle(message);
    message.channel.send("Queue has been shuffled!");
  }
}
module.exports = Shuffle;
