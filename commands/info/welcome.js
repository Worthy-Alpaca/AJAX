const { RichEmbed } = require("discord.js");
const { getMember, formatDate, getMsg, getChnl } = require("../../functions.js");
const { stripIndents } = require("common-tags");


module.exports = {
    name: "welcome",
    category: "info",
    description: "Give the welcome message",
    usage: "<mention>",

    run: async (client, message, args, con) => {

        if (message.deletable) message.delete();
        
        //const member = getMember(message, args.join(" "));
        const member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member) return message.reply("You need to welcome someone.")

        var greeting = await getMsg(member, con);   
        var channel = await getChnl(member, con)
        const embed = new RichEmbed()
                .setColor("RANDOM")
                .setTimestamp()
                .setAuthor(`Hooray, ${member.displayName} just joined our merry band of misfits`, member.user.displayAvatarURL)
                .setDescription(stripIndents`${greeting}`);   
            
        return channel.send(embed);
         
    }
    
}