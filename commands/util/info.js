const Command = require("../../assets/class/Command");
const { SlashCommandBuilder } = require('@discordjs/builders');
const path = require("path");

class Info extends Command {
    constructor() {
        super({
            name: "info"
        })
        let dirPath = path.join(__dirname, this.name);
        this.init(dirPath);
    }
    data = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription("Get info about a user or a server!")
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Info about a user')
                .addUserOption(option => option.setName('target').setDescription('The user')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Info about the server'));

}


module.exports = Info;
