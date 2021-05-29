const Command = require("../../assets/class/Command");

class Loop extends Command {
  constructor() {
    super({
      name: "loop",
      alias: ["l"],
      public: true,
      description: "Circles, circles everywhere",
      usage: ["<prefix>loop "],
    });
  }
  async run(client, message, args) {
    client.distube.setRepeatMode(message, parseInt(args[0]));
    message.channel.send(`Loop has been activated!`);
  }
}

module.exports = Loop;
