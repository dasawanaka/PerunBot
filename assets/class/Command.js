const path = require("path");
const fs = require("fs");
const developers = require("../../developers.json");
const { MessageEmbed } = require("discord.js");

class Command {
  constructor(options) {
    if (!options.name) throw new Error("Command must have a name");

    this.name = options.name;

    if (options.alias) this.alias = options.alias;

    if (options.public) this.public = options.public;

    if (options.description) this.description = options.description;

    if (options.usage) this.usage = options.usage;

    if (options.examples) this.examples = options.examples;

    if (options.cooldown) this.cooldown = options.cooldown;

    if (options.clientPermissions)
      this.clientPermissions = options.clientPermissions;

    if (options.userPermissions) this.userPermissions = options.userPermissions;

    if (options.hasSubCommands) this.hasSubCommands = options.hasSubCommands;

    if (options.dev) this.dev = options.dev;

    this.logger = require("../../DefaultLogger.js").get();
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
            this.subCommands.keys()
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

    if (!command.checkPermissions(message)) return;
    command.run(client, message, args);
  }

  checkPermissions(interaction) {
    console.log("Checking permissions" )
    if (
      !interaction.channel
        .permissionsFor(interaction.guild.me)
        .has(["SEND_MESSAGES", "EMBED_LINKS"])
    )
      return false;
    const devPermissions = this.checkDevPermissions(interaction);
    const clientPermission = this.checkClientPermissions(interaction);
    const userPermission = this.checkUserPermissions(interaction);
    if (clientPermission && userPermission && devPermissions) return true;
    else return false;
  }

  /**
   * Code modified from: https://github.com/discordjs/Commando/blob/master/src/commands/base.js
   */
  checkUserPermissions(interaction) {
    console.log("Checking permissions for user " )
    if (interaction.memberPermissions.has("ADMINISTRATOR")) return true;

    if (this.userPermissions) {
      const missingPermissions = interaction.channel
        .permissionsFor(interaction.member)
        .missing(this.userPermissions)
        .map((p) => permissions[p]);
      if (missingPermissions.length !== 0) {
        const embed = new MessageEmbed()
          .setAuthor(
            `${interaction.client.user.tag}`,
            interaction.client.user.displayAvatarURL({ dynamic: true })
          )
          .setTitle(`🙄 Missing User Permissions: \`${this.name}\``)
          .setDescription(
            `\`\`\`DIFF:\n${missingPermissions
              .map((p) => `- ${p}`)
              .join("\n")}\`\`\``
          )
          .setTimestamp()
          .setColor("#eb3483");
          interaction.channel.send(embed);
        return false;
      }
    }
    return true;
  }

  checkClientPermissions(interaction) {
    console.log("Checking permissions for client" )
    const missingPermissions = interaction.channel
      .permissionsFor(interaction.guild.me)
      .missing(this.clientPermissions)
      .map((p) => permissions[p]);
    if (missingPermissions.length !== 0) {
      const embed = new MessageEmbed()
        .setAuthor(
          `${interaction.client.user.tag}`,
          interaction.client.user.displayAvatarURL({ dynamic: true })
        )
        .setTitle(`🙄 Missing Bot Permissions: \`${this.name}\``)
        .setDescription(
          `\`\`\`DIFF\n${missingPermissions
            .map((p) => `- ${p}`)
            .join("\n")}\`\`\``
        )
        .setTimestamp()
        .setColor("#eb3483");
      interaction.channel.send(embed);
      return false;
    } else return true;
  }

  checkDevPermissions(interaction) {
    console.log("Checking permissions for dev" )
    const userID = interaction.member.id;
    if (!this.dev) return true;
    let userIsDeveloper = false;
    for (const dev in developers) {
      const developer = developers[dev];
      if (developer.id === userID) {
        userIsDeveloper = true;
        return userIsDeveloper;
      }
    }
    if (!userIsDeveloper) {
      const embed = new MessageEmbed()
        .setAuthor(
          `${interaction.client.user.tag}`,
          interaction.client.user.displayAvatarURL({ dynamic: true })
        )
        .setTitle(`🙄 Missing Developer Permissions: \`${this.name}\``)
        .setDescription(`\`\`\`YOU ARE NOT A BOT DEVELOPER\`\`\``)
        .setTimestamp()
        .setColor("#eb3483");
      interaction.channel.send(embed);
    }
    return false;
  }

  loadSubCommands(dirPath) {
    // const commandFiles = fs
    //   .readdirSync(dirPath)
    //   .filter((file) => file.endsWith(".js"));

    // if (commandFiles.length > 0) {
    //   this.logger.info(
    //     `🔍 Sub commands dir with ${commandFiles.length} commands.`
    //   );
    //   for (const file of commandFiles) {
    //     const commandPath = path.join(dirPath, file);
    //     this.logger.info(`⏳ Try to load sub command ${file}`);
    //     const subCommandClass = require(commandPath);
    //     const command = new subCommandClass();
    //     this.subCommands.set(command.name.toLowerCase(), command);
    //     if (command.alias != undefined)
    //       command.alias.forEach((al) => {
    //         this.subCommands.set(al.toLowerCase(), command);
    //       });
    //     this.logger.info(`✅ Register sub command ${command.name}`);
    //   }
    // }
    return;
  }
}

module.exports = Command;
