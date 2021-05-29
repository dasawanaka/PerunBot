const { MessageEmbed } = require("discord.js");
const Command = require("../../assets/class/Command");

class Autoplay extends Command {
  constructor() {
    super({
      name: "autoplay",
      alias: [],
      public: true,
      description: "Robot goes brr!",
      usage: ["<prefix>autoplay"],
    });
  }
  async run(client, message, args) {
    let mode = client.distube.toggleAutoplay(message);
    const embed = new MessageEmbed()
      .setTitle("Autoplay mode")
      .setDescription(mode ? "On" : "Off");

    message.channel.send(embed);
  }
}

module.exports = Autoplay;
