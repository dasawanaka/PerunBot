const permissions = require('../assets/other/permissions.json')
const {MessageEmbed} = require('discord.js')

class PermissionsChecker {
  static async init() {}

  static checkPermissions(
    message,
    requiredClientPermissions,
    requiredUserPermissions,
    commandName
  ) {
    if (
      !message.channel
        .permissionsFor(message.guild.me)
        .has(["SEND_MESSAGES", "EMBED_LINKS"])
    )
      return false;

    const clientPermission = this.checkClientPermissions(
      message,
      requiredClientPermissions
    );
    const userPermission = this.checkUserPermissions(
      message,
      requiredUserPermissions,
      commandName
    );
    if (clientPermission && userPermission) return true;
    else return false;
  }

  /**
   * Code modified from: https://github.com/discordjs/Commando/blob/master/src/commands/base.js
   */
  static checkUserPermissions(message, requiredPermissions, commandName) {
    if (message.member.hasPermission("ADMINISTRATOR")) return true;

    if (requiredPermissions) {
      const missingPermissions = message.channel
        .permissionsFor(message.author)
        .missing(requiredPermissions)
        .map((p) => permissions[p]);
      if (missingPermissions.length !== 0) {
        const embed = new MessageEmbed()
          .setAuthor(
            `${message.author.tag}`,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setTitle(`🙄 Missing User Permissions: \`${commandName}\``)
          .setDescription(
            `\`\`\`DIFF:\n${missingPermissions
              .map((p) => `- ${p}`)
              .join("\n")}\`\`\``
          )
          .setTimestamp()
          .setColor("#eb3483");
        message.channel.send(embed);
        return false;
      }
    }
    return true;
  }

  static checkClientPermissions(message, requiredPermissions) {
    const missingPermissions = message.channel
      .permissionsFor(message.guild.me)
      .missing(requiredPermissions)
      .map((p) => permissions[p]);
    if (missingPermissions.length !== 0) {
      const embed = new MessageEmbed()
        .setAuthor(
          `${this.client.user.tag}`,
          message.client.user.displayAvatarURL({ dynamic: true })
        )
        .setTitle(`${fail} Missing Bot Permissions: \`${this.name}\``)
        .setDescription(
          `\`\`\`DIFF\n${missingPermissions
            .map((p) => `- ${p}`)
            .join("\n")}\`\`\``
        )
        .setTimestamp()
        .setColor("#eb3483");
      message.channel.send(embed);
      return false;
    } else return true;
  }
}

module.exports = PermissionsChecker;
