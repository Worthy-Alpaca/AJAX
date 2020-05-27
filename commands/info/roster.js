const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getAdmin, getMod } = require("../../functions");


module.exports = {
    name: "roster",
    category: "info",
    description: "People who do stuff",
    

    run: async (client, message, args, con) => {
        if (message.deletable) message.delete();

        const guild = message.channel.guild;

        var admin = await getAdmin(message, con);
        var moderator = await getMod(message, con);
        var name
        var admins = [];
        var moderators = [];
        console.log(admin)
        if (admin === null) {
            return message.channel.send("You need to set the role for admin first. Do that by typing !setadmin")
        }
        if (moderator === null) {
            return message.channel.send("You need to set the role for moderator first. Do that by typing !setmod")
        }
        
        guild.members.forEach(member => {
            if (member.roles.has(message.guild.roles.find(r => r.name === admin).id)){
                if (member.id === client.user.id) {
                    return
                } else {
                    name = member.displayName
                    admins.push(name)
                }
            } else if(member.roles.has(message.guild.roles.find(r => r.name === moderator).id)) {
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
            .addField('**ADMINS**', stripIndents`${admins.join('\n')}`, true)
            .addField('**MODERATORS**', stripIndents`${moderators.filter(n => !admins.includes(n)).join('\n')}`, true)
        
        return message.channel.send(embed);
        
    }
    
}

