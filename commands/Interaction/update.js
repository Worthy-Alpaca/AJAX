const { welcome_channel, version } = require("../../config.json");
const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");


module.exports = {
    name: "update",
    description: "Sends the update message of the bot",
    run: async (client, message, args) => {
        message.delete();

        if (!message.member.hasPermission("ADMINISTRATOR"))
            return;



        var channel = message.guild.channels.find(channel => channel.name === `${welcome_channel}`);


        const embed2 = new RichEmbed()
            .setColor("Random")
            .setTimestamp()
            .setAuthor("Update occured", client.user.displayAvatarURL)
            .setDescription(stripIndents`I have been updated. :grin: 
        New version: ${version}`);



        return channel.send(embed2);

    }
}