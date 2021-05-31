const EmbedGenerator = require("./EmbedGenerator");
const { MessageButton } = require("discord-buttons");
const buttonStyles = ["blurple", "grey", "green", "red"];

class ButtonGenerator {
  static async createReactionButton(message, mtd) {
    var buttons = [];

    var count;
    while (!count || count < 0 || count > 5) {
      mtd.push(
        await message.channel.send(
          EmbedGenerator.createSmallEmbed(
            ":pencil:",
            "How many buttons u want to create(max: 5)"
          )
        )
      );

      let collector = this.createCustomCollector(message, mtd);
      count = await this.getContent(collector);
      count = parseInt(count[0]);
    }

    for (var i = 0; i < count; i++) {
      //get style for button
      let style;
      while (!style || !buttonStyles.includes(style)) {
        mtd.push(
          await message.channel.send(
            EmbedGenerator.createSmallEmbed(
              ":pencil:",
              `[BTN_${i}] Type button style(one of: ${buttonStyles.join(", ")})`
            )
          )
        );
        let collector = this.createCustomCollector(message, mtd);
        style = await this.getContent(collector);
        style = style[0];
      }

      //get text for button
      let text;
      while (!text || text.length > 80) {
        mtd.push(
          await message.channel.send(
            EmbedGenerator.createSmallEmbed(
              ":pencil:",
              `[BTN_${i}] Type button label(**max 80** characters)`
            )
          )
        );
        let collector = this.createCustomCollector(message, mtd);
        text = await this.getContent(collector);
        text = text[0];
      }

      let role;
      while (!role) {
        mtd.push(
          await message.channel.send(
            EmbedGenerator.createSmallEmbed(
              ":pencil:",
              `[BTN_${i}] Mention the role that is to be given when clicking the button.`
            )
          )
        );
        let collector = this.createCustomCollector(message, mtd);
        role = await this.getRoleMentions(collector);
        role = role[0];
      }

      let btn = new MessageButton()
      .setStyle(style)
      .setLabel(text)
      .setID(`br_${role.id}`);

      buttons.push(btn);
    }

    return buttons;
  }

  static getContent(collector) {
    return new Promise((resolve, reject) => {
      collector.on("end", (collected) =>
        resolve(collected.map((m) => m.content))
      );
    });
  }

  static getRoleMentions(collector) {
    return new Promise((resolve, reject) => {
      collector.on("end", (collected) =>
        resolve(
          collected.map(
            (m) =>
              m.mentions.roles.first() || m.guild.roles.cache.get(m.content)
          )
        )
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
}
module.exports = ButtonGenerator;
