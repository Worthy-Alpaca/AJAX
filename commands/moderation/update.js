const { welcome_channel, version, status } = require("../../src/config.json");
const Discord  = require("discord.js");
const { stripIndents } = require("common-tags");


module.exports = {
    name: "update",
    category: "moderation",
    permission: ["null"],
    description: "Updates the bot",
    run: async (client, message, args, con) => {
        message.delete();


        if (message.author.id !== "595341356432621573")
            return message.reply("You are not powerful enough to command me in such a way!").then(m => m.delete( {timeout: 5000} ));
            
            
        
        //var channel = message.guild.channels.cache.find(channel => channel.name === `${welcome_channel}`);

        

        client.user.setPresence({
            status: "invisible",
            game: {
                name: `${status}`,
                type: "WATCHING"
            }
        });

        setTimeout(() => {
            client.user.setPresence({
                status: "online",
                game: {
                    name: `${status}`,
                    type: "LISTENING"
                }
            })
        }, 5000)
        if (args[0] === "send") {
            
            const embed2 = new Discord.MessageEmbed()
                .setColor("Random")
                .setTimestamp()
                .setAuthor("Update occured", client.user.displayAvatarURL())
                .setDescription(stripIndents`I have been updated. :grin: 
                New version: **${version}**`);
            
            client.guilds.cache.forEach(server => {
                channel = server.channels.cache.find(channel => channel.id === server.systemChannelID);

                if (!channel) {
                    return message.reply(`\`${server.name}\` did not receive update notification.`)
                }

                return channel.send(embed2).catch();
            })

            
 
            
        } else return

        
        

    }
}