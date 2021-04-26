const { arg } = require("mathjs");

module.exports = {
    name: 'vote',
    alias: ['v'],
    public: true,
    description: 'this is a vote command',
    async run(client, message, args) {
        try {
            let test = args[0] != null ? args[0].toLowerCase() : 'none';
            switch (test) {
                case 'yn':
                    await message.react('738499101083304098');
                    await message.react('738499100781314108');
                    break;
                case 'pm':
                    await message.react('738499101049749626');
                    await message.react('738499100768469082');
                    break;
                case 'none':
                default:
                    await message.react('✅');
                    await message.react('❎');
            }
        }
        catch (error) {
            console.error('One of the emojis failed to react.');
        }
    }
}