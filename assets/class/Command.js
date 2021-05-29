const path = require("path");
const fs = require("fs");
const colors = require("colors");

class Command {
  constructor(options) {
    if (!options.name) throw new Error("Command must have a name");

    this.name = options.name;

    if (options.alias) this.alias = options.alias;

    if (options.public) this.public = options.public;

    if (options.description) this.description = options.description;

    if (options.usage) this.usage = options.usage;

    if (options.examples) this.examples = options.examples;

    if (options.clientPermissions)
      this.clientPermissions = options.clientPermissions;

    if (options.userPermissions) this.userPermissions = options.userPermissions;

    if (options.hasSubCommands) this.hasSubCommands = options.hasSubCommands;
  }

  init(dirPath) {
    this.subCommands = new Map();
    this.loadSubCommands(dirPath);
  }

  run(client, message, args) {
    let action = args.shift();

    if (!action) {
      return message.channel.send({
        embed: {
          color: 16734039,
          description: `❌ | You must provide a action( ${Array.from(
            subCommands.keys()
          ).join(" | ")} )`,
        },
      });
    }
    let command = this.subCommands.get(action);
    if (!command) {
      return message.channel.send({
        embed: {
          color: 16734039,
          description: `❌ | You must provide a **VALID** action( ${Array.from(
            this.subCommands.keys()
          ).join(" | ")} )`,
        },
      });
    }
    command.run(client, message, args);
  }

  checkPermissions(message) {
    if (
      !message.channel
        .permissionsFor(message.guild.me)
        .has(["SEND_MESSAGES", "EMBED_LINKS"])
    )
      return false;

    const clientPermission = this.checkClientPermissions(message);
    const userPermission = this.checkUserPermissions(message);
    if (clientPermission && userPermission) return true;
    else return false;
  }

  /**
   * Code modified from: https://github.com/discordjs/Commando/blob/master/src/commands/base.js
   */
  checkUserPermissions(message) {
    if (message.member.hasPermission("ADMINISTRATOR")) return true;

    if (this.userPermissions) {
      const missingPermissions = message.channel
        .permissionsFor(message.author)
        .missing(this.userPermissions)
        .map((p) => permissions[p]);
      if (missingPermissions.length !== 0) {
        const embed = new MessageEmbed()
          .setAuthor(
            `${message.author.tag}`,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setTitle(`🙄 Missing User Permissions: \`${this.name}\``)
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

  checkClientPermissions(message) {
    const missingPermissions = message.channel
      .permissionsFor(message.guild.me)
      .missing(this.userPermissions)
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

  loadSubCommandss = (dirPath) => {
    console.log(dirPath);
  };

  loadSubCommands(dirPath) {
    console.log(dirPath);
    const commandFiles = fs
      .readdirSync(dirPath)
      .filter((file) => file.endsWith(".js"));

    console.log(
      colors.bold.bgCyan.yellow(`[SUB COMMANDS]`) +
        colors.green(
          ` find sub commands dir with ${commandFiles.length} commands.`
        )
    );

    if (commandFiles.length > 0) {
      for (const file of commandFiles) {
        const commandPath = path.join(dirPath, file);
        console.log(
          colors.bold.blue(`[TRY]`) +
            colors.blue(` Try to load sub command from ${commandPath}`)
        );
        const subCommandClass = require(commandPath);
        const command = new subCommandClass();
        this.subCommands.set(command.name.toLowerCase(), command);
        if (command.alias != undefined)
          command.alias.forEach((al) => {
            this.subCommands.set(al.toLowerCase(), command);
          });
        console.log(
          colors.bold.bgBlue.yellow(`[DONE]`) +
            colors.green(
              ` Register sub command ${command.name} from ${commandPath}`
            )
        );
      }
    }
    return;
  }
}

module.exports = Command;
