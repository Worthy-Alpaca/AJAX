const { RichEmbed } = require("discord.js");
const { getAdmin, getMod } = require("../../functions/functions.js")

module.exports = {
    name: "say",
    aliases: ["bc", "broadcast"],
    description: "Bot says stuff",
    usage: "[channel], <input>",
    run: async (client, message, args, con) => {
        message.delete();

        var admin = await getAdmin(message, con);
        var moderator = await getMod(message, con);

        if (admin === null) {
            return message.channel.send("You need to set the role for admin first. Do that by typing !setadmin")
        }
        if (moderator === null) {
            return message.channel.send("You need to set the role for moderator first. Do that by typing !setmod")
        }

        if (!message.member.roles.has(message.guild.roles.find(r => r.id=== admin).id))
            return message.reply("You don't have the required permissions to use this command.").then(m => m.delete(5000));

        

        const roleColor = message.guild.me.highestRole.hexColor;

          
        var b;
        
        var chnl = Array.from(args[0])
        
        if (chnl.includes("#")) {
            b = chnl.slice(2, chnl.indexOf(">"))           
            var channel = message.guild.channels.find(channel => channel.id === b.join(""));       
        } else {
            var channel = message.guild.channels.find(channel => channel.name === chnl.join(""));
        }
                
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
