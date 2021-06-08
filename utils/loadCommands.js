const path = require('path');
const fs = require('fs');
const colors = require('colors');
const helpGenerator = require('./HelpGenerator');
const logger = require('../DefaultLogger').get();

module.exports = {
    name: 'loadCommandsModule',
    description: 'this is a loader for commands',
    async load(commandDirPath, client) {

        const commandModules = fs.readdirSync(commandDirPath);
        for (const module of commandModules) {

            var modulePath = path.join(commandDirPath, module);
            const commandFiles = fs.readdirSync(modulePath).filter(file => file.endsWith('.js'));

            if (commandFiles.length > 0) {
                logger.info(`🔍 Find ${module} module with ${commandFiles.length} commands.`);
                for (const file of commandFiles) {
                    const commandPath = path.join(commandDirPath, module, file);
                    logger.info(`⏳ Try to load command from ${module}/${file}`);
                    const CommandClass = require(commandPath);
                    const command = new CommandClass();
                    client.commands.set(command.name.toLowerCase(), command);
                    helpGenerator.addCommand(command, module);
                    if (command.alias != undefined)
                        command.alias.forEach(al => {
                            client.commands.set(al.toLowerCase(), command);
                        });
                        logger.info(`✅ Register command ${command.name}`);
                }
            }

        }

    }
}