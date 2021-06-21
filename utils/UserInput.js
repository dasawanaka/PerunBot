class UserInput {
  static async getNumber(message, mtd) {
    var nn;
    let collector = this.createCustomCollector(message, mtd);
    nn = await this.getContent(collector);
    try {
      nn = parseInt(nn[0]);
    } catch (error) {
      return Number.NaN;
    }
    return nn;
  }

  static async getText(message, mtd) {
    var text;
    let collector = this.createCustomCollector(message, mtd);
    text = await this.getContent(collector);
    text = text[0];
    return text;
  }

  static async getUserRoleMention(message, mtd) {
    var role;
    let collector = this.createCustomCollector(message, mtd);
    role = await this.getRoleMentions(collector);
    role = role[0];
    return role;
  }

  static async getUserChannelMention(message, mtd) {
    var role;
    let collector = this.createCustomCollector(message, mtd);
    role = await this.getChannelMentions(collector);
    role = role[0];
    return role;
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
  static getChannelMentions(collector) {
    return new Promise((resolve, reject) => {
      collector.on("end", (collected) =>
        resolve(
          collected.map(
            (m) =>
              m.mentions.channels.first() || m.guild.channels.cache.get(m.content)
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
      maxMatches: 1,
      time: 60000,
      errors: ["time"],
    });
    collector.on("collect", (msg) => {
      messagesToDelete.push(msg);
      collector.stop();
    });
    return collector;
  }
}
module.exports = UserInput;
