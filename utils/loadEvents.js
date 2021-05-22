const path = require('path');
const fs = require('fs');
const colors = require('colors');

module.exports = {
    name: 'loadEventsModule',
    description: 'this is a loader for events',
    async load(eventDirPath, client) {

        const eventModules = fs.readdirSync(eventDirPath);
        for (const module of eventModules) {

            var eventPath = path.join(eventDirPath, module);
            const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith('.js'));

            console.log(colors.bold.bgCyan.yellow(`[EVENT]`) + colors.green(` find module ${module} with ${eventFiles.length} events.`))

            if (eventFiles.length > 0) {
                for (const file of eventFiles) {
                    const eventPath = path.join(eventDirPath, module, file);
                    const event = require(eventPath);
                    client.events.set(event.name, event);
                    console.log(colors.bold.bgBlue.yellow(`[DONE]`) + colors.green(` Register event ${event.name} from ${eventPath}`))
                }
            }

        }

    }
}