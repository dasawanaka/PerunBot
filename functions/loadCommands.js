const { arg } = require("mathjs");
const path = require('path');
const fs = require('fs');
const colors = require('colors');

module.exports = {
    name: 'loadCommandsModule',
    description: 'this is a loader for commands',
    async load(commandDirPath, client) {

        const commandModules = fs.readdirSync(commandDirPath);
        for (const module of commandModules) {

            var modulePath = path.join(commandDirPath, module);
            const commandFiles = fs.readdirSync(modulePath).filter(file => file.endsWith('.js'));

            console.log(colors.bold.bgCyan.yellow(`[MODULE]`) + colors.green(` find module ${module} with ${commandFiles.length} commands.`))

            if (commandFiles.length > 0) {
                for (const file of commandFiles) {
                    const commandPath = path.join(commandDirPath, module, file);
                    const command = require(commandPath);
                    client.commands.set(command.name, command);
                    if (command.alias != undefined)
                        command.alias.forEach(al => {
                            client.commands.set(al, command);
                        });
                    console.log(colors.bold.bgBlue.yellow(`[DONE]`) + colors.green(` Register command ${command.name} from ${commandPath}`))
                }
            }

        }

    }
}