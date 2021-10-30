const fs = require('fs');
var align = require('align-text');

module.exports = {
    name: 'loadEventsModule',
    description: 'this is a loader for events',
    async load(client) {

        const eventFiles = fs.readdirSync(`${client.dirname}/events`).filter(file => file.endsWith('.js'));
        for (const file of eventFiles) {
            const event = require(`${client.dirname}/events/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
            client.logger.info('│✅ │' + align(`${event.name}`,3));
        }

    }
}