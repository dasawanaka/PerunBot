const {MessageEmbed} = require("discord.js");

module.exports = {
  name: "autoplay",
  alias: [],
  public: true,
  description: "Robot goes brr!",
  usage: ["<prefix>autoplay"],
  async run(client, message, args) {
    
    let mode = client.distube.toggleAutoplay(message);
    const embed = new MessageEmbed()
    .setTitle('Autoplay mode')
    .setDescription(mode ? "On" : "Off");

    message.channel.send(embed)
    
  },
};
