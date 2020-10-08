const Discord  = require("discord.js");
const { stripIndents } = require("common-tags");
const { getAdmin, getMod } = require("../../functions/db_queries.js");

module.exports = {
    name: "roster",
    category: "info",
    permission: ["none", "moderator", "admin"],
    description: "People who do stuff",
    
    run: async (client, message, args, api) => {

        const guild = message.channel.guild;

        //var admin = await getAdmin(message);
        //var moderator = await getMod(message);        
        var admins = [];
        var moderators = [];
        var bots = [];
        
        if (api.admin === null) { //###########################
            return message.channel.send("You need to set the role for admin first. Do that by typing !setadmin")
        }
        if (api.moderator === null) { //###########################
            return message.channel.send("You need to set the role for moderator first. Do that by typing !setmod")
        }
        
        guild.members.cache.forEach(member => {
            if (member.roles.cache.has(message.guild.roles.cache.find(r => r.id === api.admin).id)){
                if (member.user.bot) {                    
                    return
                } else {                    
                    admins.push(member.displayName)
                }
            } else if(member.roles.cache.has(message.guild.roles.cache.find(r => r.id === api.moderator).id)) {
                if (member.user.bot) {
                    return
                } else {                    
                    moderators.push(member.displayName)
                }
            } else if (member.user.bot) {
                bots.push(member.displayName);
            }
        })

        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setFooter(message.guild.name)
            .setTimestamp()
            .setTitle("People who do stuff")
            .addField(`**BOTS**`, stripIndents`${bots.join('\n')}`);
            
        
        if (admins.length > 0) {
            embed.addField(`**ADMINS**`, stripIndents`${admins.join('\n')}`, true);
        } else {
            embed.addField('**ADMINS**', stripIndents`It appears you either don't have any server admins or set the wrong role in the setup process... dumbass`, true);
        }
        
        if (moderators.length > 0) {
            embed.addField('**MODERATORS**', stripIndents`${moderators.filter(n => !admins.includes(n)).join('\n')}`, true);
        } else {
            embed.addField('**MODERATORS**', stripIndents`No moderators on this server`, true);
        }
        return message.channel.send(embed);
        
    }
    
}

