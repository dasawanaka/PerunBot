const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const permissions = require("../assets/other/permissions.json");
const commands = new Map();

module.exports = {
  async addCommand(command, dirName) {
    var moduleName = dirName.replace("_", " ").toUpperCase();
    var arr = !commands.get(moduleName)
      ? new Array()
      : commands.get(moduleName);
    arr.push(command);

    commands.set(moduleName, arr);
  },

  async getHelp(commandName) {
    commandName = commandName.toLowerCase();
    let command;
    commands.forEach((value, key, map) => {
      value.forEach((val) => {
        if (
          val.name === commandName ||
          (val.alias && val.alias.includes(commandName))
        )
          command = val;
      });
    });

    if (!command) {
      const embed = new MessageEmbed()
        .setTitle(`Command not found`)
        .setDescription(
          `Did\'t find command with name \`${commandName}\`.\n Please use \`help\` to see all avaiables commands.`
        )
        .setTimestamp();
      return embed;
    }

    const embed = new MessageEmbed();
    embed.setTitle(`Help for command ${command.name}`);
    embed.setDescription(command.description);

    if (command.alias && command.alias.length > 0) {
      embed.addField("Avaiable command aliases", `${command.alias.join(", ")}`);
    }
    if (command.usage && command.usage.length > 0) {
      embed.addField("How to use command", `${command.usage.join("\n")}`);
    }
    if (command.examples && command.examples.length > 0) {
      embed.addField("Examples", `${command.examples.join("\n")}`);
    }
    if (command.cooldown) {
      embed.addField("Comamnd cooldown", `${ms(command.cooldown)}`);
    }
    if (command.userPermissions && command.userPermissions.length > 0) {
      embed.addField(
        "Required user permissions",
        `${command.userPermissions.map((t) => permissions[t]).join("\n")}`
      );
    }
    return embed;
  },

  generateHelpEmbeds() {
    const results = [];
    commands.forEach((value, key, map) => {
      var desc = "";
      value.forEach((val) => {
        desc += `\`${val.name}\`: ${val.description}\n`;
      });

      var embed = new MessageEmbed()
        .setTitle(key)
        .setDescription(desc)
        .setTimestamp();
      results.push(embed);
    });
    return results;
  },
};
