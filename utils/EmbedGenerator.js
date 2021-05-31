const { MessageEmbed } = require("discord.js");
const ms = require("ms");

class EmbedGenerator {
  static async createUserEmbed(message, messagesToDelete) {
    messagesToDelete.push(
      await message.channel.send(
        this.createSmallEmbed(
          ":pencil:",
          'Type "done" when u want to skip step.\nType Colour [blue, yellow, red, green] or in html'
        )
      )
    );

    let collector = this.createCustomCollector(message, messagesToDelete);

    var colour = await this.getContent(collector);
    //console.log(colour)
    colour = colour[0].toLowerCase();
    switch (colour) {
      case "blue":
        colour = `#0000cc`;
        break;
      case "yellow":
        colour = `#ffff00`;
        break;
      case "red":
        colour = `#cc0000`;
        break;
      case "green":
        colour = `#00ff00`;
        break;
      case "none":
      default:
        if (!colour.startsWith("#")) colour = `#ff0066`;
    }
    messagesToDelete.push(
      await message.channel.send(this.createSmallEmbed(null, "Type title"))
    );
    collector = this.createCustomCollector(message, messagesToDelete);
    var title = await this.getContent(collector);

    messagesToDelete.push(
      await message.channel.send(
        this.createSmallEmbed(null, "Type description")
      )
    );
    collector = this.createCustomCollector(message, messagesToDelete);
    var description = await this.getContent(collector);

    messagesToDelete.push(
      await message.channel.send(this.createSmallEmbed(null, "Set Url"))
    );
    collector = this.createCustomCollector(message, messagesToDelete);

    var customURL = await this.getContent(collector);
    customURL = customURL[0];

    messagesToDelete.push(
      await message.channel.send(
        this.createSmallEmbed(null, "Set Thumbnail (url)")
      )
    );
    collector = this.createCustomCollector(message, messagesToDelete);
    var thumbnail = await this.getContent(collector);
    thumbnail = thumbnail[0];

    messagesToDelete.push(
      await message.channel.send(this.createSmallEmbed(null, "Set Image (url)"))
    );
    collector = this.createCustomCollector(message, messagesToDelete);
    var setImage = await this.getContent(collector);
    setImage = setImage[0];

    messagesToDelete.push(
      await message.channel.send(this.createSmallEmbed(null, "Set footer"))
    );
    collector = this.createCustomCollector(message, messagesToDelete);
    var footer = await this.getContent(collector);

    let embed = new MessageEmbed()
      .setTitle(title)
      .setColor(colour)
      .setDescription(description)
      .setURL(customURL)
      .setAuthor(
        `${message.author.tag}`,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setThumbnail(thumbnail)
      // .addFields(
      // { name: 'Regular field title', value: 'Some value here' },
      // { name: '\u200B', value: '\u200B' },
      // { name: 'Inline field title', value: 'Some value here', inline: true },
      // { name: 'Inline field title', value: 'Some value here', inline: true },
      // .addField('Inline field title', 'Some value here', true)
      .setImage(setImage)
      .setTimestamp()
      .setFooter(footer);

    return embed;
  }

  static getContent(collector) {
    return new Promise((resolve, reject) => {
      collector.on("end", (collected) =>
        resolve(collected.map((m) => m.content))
      );
    });
  }

  static createCustomCollector(message, messagesToDelete) {
    let filter = (m) => {
      if (m.author.id === message.author.id) {
        if (m.content.toLowerCase() === "done") {
          messagesToDelete.push(m);
          collector.stop();
        } else return true;
      } else return false;
    };
    let collector = message.channel.createMessageCollector(filter, {
      maxMatches: 1, time: 30000
    });
    collector.on("collect", (msg) => {
      messagesToDelete.push(msg);
      collector.stop();
    });

    return collector;
  }

  static createSmallEmbed(emoji, message, color) {
    if (!emoji) emoji = ":pencil:";
    if (!message)
      message =
        "Empty message content, please check your code. Idiot programer..";
    if (!color) color = "#03b1fc";
    return {
      embed: {
        color: color,
        description: `${emoji} | ${message}`,
      },
    };
  }
}
module.exports = EmbedGenerator;
