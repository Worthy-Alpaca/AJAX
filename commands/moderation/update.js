const { welcome_channel, version, status } = require("../../src/config.json");
const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { exec } = require("child_process");

module.exports = {
    name: "update",
    category: "moderation",
    description: "Updates the bot",
    run: async (client, message, args, con) => {
        message.delete();


        if (message.author.id !== "595341356432621573")
            return message.reply("You are not powerfull enough to command me in such a way!").then(m => m.delete(5000));
            
            
        
        var channel = message.guild.channels.find(channel => channel.name === `${welcome_channel}`);

        

        exec("update.sh", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });

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
                    type: "WATCHING"
                }
            })
        }, 5000)
        if (args[0] === "send") {
            setTimeout(() => {
                const embed2 = new RichEmbed()
                    .setColor("Random")
                    .setTimestamp()
                    .setAuthor("Update occured", client.user.displayAvatarURL)
                    .setDescription(stripIndents`I have been updated. :grin: 
                    New version: **${version}**`);

                return channel.send(embed2);
 
            }, 7000)
        } else return

        
        

    }
}