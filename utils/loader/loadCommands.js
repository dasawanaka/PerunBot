const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { discord_conf } = require(`./../../config.json`);
const path = require("path");
const fs = require("fs");
var align = require('align-text');
//const helpGenerator = require("./HelpGenerator");

module.exports = {
  name: "loadCommands",
  description: "Simple command loader with subcommands",
  async load(commandDirPath, client) {
    client.logger.info("COMMANDS");
    client.logger.info("▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬");
    const commands = [];
    const commandModules = fs.readdirSync(commandDirPath);
    for (const module of commandModules) {
      var modulePath = path.join(commandDirPath, module);
      const commandFiles = fs
        .readdirSync(modulePath)
        .filter((file) => file.endsWith(".js"));

      if (commandFiles.length > 0) {
        for (const file of commandFiles) {
          const commandPath = path.join(commandDirPath, module, file);
          const CommandClass = require(commandPath);
          const command = new CommandClass();
          client.commands.set(command.name.toLowerCase(), command);
          //helpGenerator.addCommand(command, module);
          if (command.alias != undefined)
            command.alias.forEach((al) => {
              client.commands.set(al.toLowerCase(), command);
            });
            commands.push(command.data.toJSON());

            client.logger.info('│✅ │' + align(`${module} / ${command.name}`,1));
        }
      }
    }
    //send/register slash command using REST
    const rest = new REST({ version: '9' }).setToken(discord_conf.token);
    (async () => {
        try {
            client.logger.info('Started refreshing application (/) commands.');
    
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );
            client.logger.info('Successfully reloaded application (/) commands.');
        } catch (error) {
            client.logger.error(`Error refreshing application (/) commands. Error: ${error}`);
        }
    })();

  },
};
