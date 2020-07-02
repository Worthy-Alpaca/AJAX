const Discord  = require("discord.js");
const { getAdmin, getMod } = require("../../functions/db_queries.js")

module.exports = {
    name: "say",
    aliases: ["bc", "broadcast"],
    category: "moderation",
    permission: ["admin"],
    description: "Let the bot speak on your behalf",
    descriptionlong: "Let the bot speak on your behalf. Can be used across channels and also send an embed",
    usage: "[channel] [embed] <input>",
    run: async (client, message, args, con) => {
        message.delete();

        var admin = await getAdmin(message, con);
        var moderator = await getMod(message, con);

        if (admin === null) {
            return message.channel.send("You need to set the role for admin first. Do that by typing !setadmin").then(m => m.delete( {timeout: 5000} ));
        }
        if (moderator === null) {
            return message.channel.send("You need to set the role for moderator first. Do that by typing !setmod").then(m => m.delete( {timeout: 5000} ));
        }

        if (!message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id=== admin).id))
            return message.reply("You don't have the required permissions to use this command.").then(m => m.delete( {timeout: 5000} ));

        

        const roleColor = message.guild.me.highestRole.hexColor;
        if (typeof args[0] == 'undefined') {
            return message.channel.send("Maybe include something :wink:")
        } 
            
        var chnl = Array.from(args[0])
        
        if (chnl.includes("#")) {
            b = chnl.slice(2, chnl.indexOf(">"))           
            var channel = message.guild.channels.cache.find(channel => channel.id === b.join(""));       
        } else {
            var channel = message.guild.channels.cache.find(channel => channel.name === chnl.join(""));
        }
                
        if (channel) {
            if (typeof args[1] == 'undefined') {
                return message.channel.send("Maybe include a message :wink:")
            } 
        }       

        if (!channel) {
            if (args[0].toLowerCase() === "embed") {
            const embed = new Discord.MessageEmbed()
                .setDescription(args.slice(1).join(" "))
                .setColor(roleColor === "#000000" ? "#ffffff" : roleColor);

                message.channel.send(embed);
             } else {
                message.channel.send(args.slice(0).join(" "));
            }
        } else {
            if (args[1].toLowerCase() === "embed") {
                const embed = new Discord.MessageEmbed()
                    .setDescription(args.slice(2).join(" "))
                    .setColor(roleColor === "#000000" ? "#ffffff" : roleColor);
    
                    channel.send(embed);
            } else {
                channel.send(args.slice(1).join(" "));
            }
        }
    }
}
