const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");


module.exports = {
    name: "roster",
    category: "info",
    description: "People who do stuff",
    

    run: async (client, message, args) => {
        if (message.deletable) message.delete();

        const guild = message.channel.guild;

        var admins = [];
        var moderators = []
        var name
        

        guild.members.forEach(member => {
            if (member.hasPermission("ADMINISTRATOR")){
                if (member.id === client.user.id) {
                    return
                } else {
                    name = member.displayName
                    admins.push(name)
                }
            } else if(member.hasPermission("KICK_MEMBERS")) {
                if (member.id === client.user.id) {
                    return
                } else {
                    name = member.displayName
                    moderators.push(name)
                }
            }
        })


        


        const embed = new RichEmbed()
            .setColor("RANDOM")
            .setFooter(message.guild.name)
            .setTimestamp()
            .setTitle("People who do stuff")
            .setThumbnail(guild.displayAvatarURL)
            .addField('ADMINS', stripIndents`${admins.join('\n')}`, true)
            .addField('MODERATORS', stripIndents`${moderators.filter(n => !admins.includes(n)).join('\n')}`, true)
        
        return message.channel.send(embed);
        
    }
    
}

