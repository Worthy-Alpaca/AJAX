const { welcome_channel, version } = require("../../config.json");
const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");


module.exports = {
    name: "update",
    category: "interaction",
    description: "Updates the bot",
    run: async (client, message, args) => {
        message.delete();

        //const father = guild.find(d => d.id === "595341356432621573");

        if (message.author.id !== "595341356432621573")
            return message.reply("You are not my father.").then(m => m.delete(5000));



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