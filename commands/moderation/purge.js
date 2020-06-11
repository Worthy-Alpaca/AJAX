const Discord  = require("discord.js");
const { stripIndents } = require("common-tags");
const { getapproved2, getChnl } = require("../../functions/functions.js");


module.exports = {
    name: "purge",
    category: "moderation",
    description: "Kicks all members who don't have the approved role",
    

    run: async (client, message, args, con) => {
        if (message.deletable) message.delete();

        if (!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply("You are not powerfull enough to do that");
        }

        const guild = message.channel.guild;
        const member = message.member;
        var approved = await getapproved2(message, con); 
        var chnl = await getChnl(member, con);
        channel = guild.channels.cache.find(channel => channel.id === chnl);
        var name;      
        var kicked = [];
        async function crtInvite(channel, member) {
            let invite = await channel.createInvite({uses: 1})
            client.users.fetch(member.id, false).then(user => {
                user.send(`You have been kicked because you did not consent to the rules of this server. You can use this invite ${invite} to come back.`)
            })
        }
       
        
        
        
        guild.members.cache.forEach(member => {
            if (member.user.bot) return;
            if (member.roles.cache.has(message.guild.roles.cache.find(r => r.id === approved).id)){
                return;
            } else {                
                crtInvite(channel, member);
                name = member.displayName
                kicked.push(name)
                member.kick("To long without verification")
            }
        })

        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setFooter(message.guild.name)
            .setTimestamp()
            .setTitle("Purging the member list")          
            
        
        if (kicked.length > 0) {
            embed.addField(`**Purged members**`, stripIndents`${kicked.join('\n')}`, true);
        } else {
            embed.addField(`**Purged members**`, stripIndents`No members purged`, true);
        }
        return message.channel.send(embed);
        
    }
    
}