const Discord  = require("discord.js");
const { stripIndents } = require("common-tags");
const { getapproved2, getChnl } = require("../../functions/db_queries.js");


module.exports = {
    name: "purge",
    category: "moderation",
    permission: ["moderator", "admin"],
    description: "Kicks all members who don't have the approved role",    

    run: async (client, message, args, con) => {
        if (message.deletable) message.delete();

        if (!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply("You are not powerful enough to do that");
        }

        const guild = message.channel.guild;
        const member = message.member;
        const reason = "Too long without agreeing to the rules";
        var approved = await getapproved2(message, con); 
        var chnl = await getChnl(member, con);
        channel = guild.channels.cache.find(channel => channel.id === chnl);
        var name;      
        var kicked = [];
        async function crtInvite(channel, member) {
            let invite = await channel.createInvite({uses: 1})
            
            await member.kick(reason)
                .catch(err => {
                    if (err) return message.channel.send(`I couldn't kick ${member.displayName}. Here's the error ${err}`)
                })
                
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
                name = member.displayName;                
                kicked.push(name);                  
            }
        })

        

        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setFooter(message.guild.name)
            .setTimestamp()
            .setTitle("Purging the member list");
            
        
        if (kicked.length > 0) {
            embed.setDescription(`I purged ${kicked.length} members`)
            .addField(`\u200b`, stripIndents`**Purged members**
            - ${kicked.join('\n- ')}`, true);
        } else {
            embed.addField(`\u200b`, stripIndents`**Purged members**
            No members purged`, true);
        }

        return message.channel.send(embed);
        
    }
    
}