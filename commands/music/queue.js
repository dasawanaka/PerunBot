const { MessageEmbed } = require("discord.js");
const Command = require("../../assets/class/Command");

class Queue extends Command {
  constructor() {
    super({
      name: "queue",
      alias: ["q"],
      public: true,
      description: "Let's check what we've got here",
      usage: ["<prefix>queue "],
    });
  }
  async run(client, message, args) {
    let queue = client.distube.getQueue(message);
    //     message.channel.send('Current queue:\n' + queue.songs.map((song, id) =>
    //     `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
    // ).slice(0, 10).join("\n"));
    const embed = new MessageEmbed().setTitle("Current queue:").setDescription(
      queue.songs
        .map(
          (song, id) =>
            `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
        )
        .slice(0, 10)
        .join("\n")
    );

    message.channel.send(embed);
  }
}
module.exports = Queue;
