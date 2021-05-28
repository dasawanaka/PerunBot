const { arg } = require("mathjs");
const path = require('path');
const fs = require('fs');
const colors = require('colors');
const helpGenerator = require('./HelpGenerator');

module.exports = {
    name: 'loadSubCommandsModule',
    description: 'this is a loader for sub commands',
    async load(dirPath, subCommandsMap) {

            const commandFiles = fs.readdirSync(dirPath).filter(file => file.endsWith('.js'));

            console.log(colors.bold.bgCyan.yellow(`[SUB COMMANDS]`) + colors.green(` find sub commands dir with ${commandFiles.length} commands.`));

            if (commandFiles.length > 0) {
                for (const file of commandFiles) {
                    const commandPath = path.join(dirPath, file);
                    console.log(colors.bold.blue(`[TRY]`) + colors.blue(` Try to load sub command from ${commandPath}`));
                    const command = require(commandPath);
                    subCommandsMap.set(command.name.toLowerCase(), command);
                    if (command.alias != undefined)
                        command.alias.forEach(al => {
                            subCommandsMap.set(al.toLowerCase(), command);
                        });
                    console.log(colors.bold.bgBlue.yellow(`[DONE]`) + colors.green(` Register sub command ${command.name} from ${commandPath}`))
                }
            }

        

    }
}