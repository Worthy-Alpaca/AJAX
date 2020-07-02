const Discord  = require("discord.js");
const { getMsg, getChnl, getapproved } = require("../../functions/db_queries.js");
const { stripIndents } = require("common-tags");


module.exports = {
    name: "welcome",
    category: "info",
    permission: ["none", "moderator", "admin"],
    description: "Give the welcome message",
    usage: "<mention>",

    run: async (client, message, args, con) => {

        if (message.deletable) message.delete();
        
        const member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member) return message.reply("You need to welcome someone.")

         greeting = await getMsg(member, con);   
         chnl = await getChnl(member, con);
         rl = await getapproved(member, con);

        

        if (typeof greeting == 'undefined') {
            greeting = "Welcome to this generic server. The owner has not bothered with a custom welcome message so you get this one."
        } else if (greeting === null) {
            greeting = "Welcome to this generic server. The owner has not bothered with a custom welcome message so you get this one."
        }
        var channel = member.guild.channels.cache.find(channel => channel.id === chnl); 

        if (typeof channel == 'undefined') {
            channel = member.guild.channels.cache.find(channel => channel.id === member.guild.systemChannelID); 
        } else if (channel === null) {
            channel = member.guild.channels.cache.find(channel => channel.id === member.guild.systemChannelID); 
        }
        const embed = new Discord.MessageEmbed() 
            .setColor("RANDOM")
            .setTimestamp()
            .setAuthor(`Hooray, ${member.displayName} just joined our merry band of misfits`, member.user.displayAvatarURL())
            .setDescription(stripIndents`${greeting}`);
        
        return channel.send(embed)
                 
    }
    
}