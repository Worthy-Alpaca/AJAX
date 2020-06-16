const Discord  = require("discord.js");
const { getranks } = require("../../functions/functions.js");
const { stripIndents } = require("common-tags");
const { get } = require("superagent");


module.exports = {
    name: "ranks",
    category: "info",
    description: "Shows available ranks",    

    run: async (client, message, args, con) => {

        const ranks = await getranks(message, con)  
        
        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setFooter("Use the !rank command to join a rank")
            .setThumbnail(message.guild.iconURL())
            .setTimestamp()
            .setTitle("Available ranks")
            .addField(`\u200b`, stripIndents`- ${ranks.join('\n- ')}`, true);  
        
        return message.channel.send(embed)
                 
    }
    
}