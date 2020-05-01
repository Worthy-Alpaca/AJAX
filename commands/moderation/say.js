const { RichEmbed } = require("discord.js");

module.exports = {
    name: "say",
    aliases: ["bc", "broadcast"],
    description: "Bot says stuff",
    usage: "[channel], <input>",
    run: async (client, message, args) => {
        message.delete();

        if (!message.member.hasPermission("MANAGE_MESSAGES"))
            return message.reply("You don't have the required permissions to use this command.").then(m => m.delete(5000));

        

        const roleColor = message.guild.me.highestRole.hexColor;

        var channel = message.guild.channels.find(channel => channel.name === `${args[0]}`);
        
        if (!channel) {
            if (typeof args[0] == 'undefined') {
                return message.channel.send("Maybe include a message :wink:")
            }  
        } else {
            if (typeof args[1] == 'undefined') {
                return message.channel.send("Maybe include a message :wink:")
            }
        }

        

        if (!channel) {
            if (args[0].toLowerCase() === "embed") {
            const embed = new RichEmbed()
                .setDescription(args.slice(1).join(" "))
                .setColor(roleColor === "#000000" ? "#ffffff" : roleColor);

                message.channel.send(embed);
             } else {
                message.channel.send(args.slice(0).join(" "));
            }
        } else {
            if (args[1].toLowerCase() === "embed") {
                const embed = new RichEmbed()
                    .setDescription(args.slice(2).join(" "))
                    .setColor(roleColor === "#000000" ? "#ffffff" : roleColor);
    
                    channel.send(embed);
            } else {
                channel.send(args.slice(1).join(" "));
            }
        }
    }
}
