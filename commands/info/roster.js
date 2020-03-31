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
        var moderators = [];
        var x = [];
        var name
        

        guild.members.forEach(member => {
            if (member.hasPermission("ADMINISTRATOR")){
                name = member.displayName
                admins.push(name)
            }   
        })

        guild.members.forEach(member => {
            if (member.hasPermission("KICK_MEMBERS")){
                name = member.displayName
                moderators.push(name)
            }   
        })


        x.push(moderators.filter(n => !admins.includes(n)))



        const embed = new RichEmbed()
            .setColor("RANDOM")
            .setFooter(message.guild.name)
            .setTimestamp()
            .setTitle("People who do stuff")
            .setThumbnail(guild.displayAvatarURL)
            .addField('ADMINS', stripIndents`${admins.join('\n')}`, true)
            .addField('MODERATORS', stripIndents`${x.join('\n')}`, true)
        
        return message.channel.send(embed);
        
    }
    
}

