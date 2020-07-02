const Discord  = require("discord.js");
const { stripIndents } = require("common-tags");
const { getAdmin, getMod, getreportschannel } = require("../../functions/db_queries.js");


module.exports = {
    name: "kick",   
    category: "moderation",
    permission: ["moderator", "admin"],
    description: "Kicks all the members you mention",
    usage: "<member>...",
    run: async (client, message, args, con) => {
        const reports = await getreportschannel(message, con);
        const logChannel = message.guild.channels.cache.find(c => c.id === reports) || message.channel;

        if (message.deletable) message.delete();

        var admin = await getAdmin(message, con);
        var moderator = await getMod(message, con);

        if (admin === null) {
            return message.channel.send("You need to set the role for admin first. Do that by typing !setadmin")
        }
        if (moderator === null) {
            return message.channel.send("You need to set the role for moderator first. Do that by typing !setmod")
        }       

        // No args
        if (!args[0] || !message.mentions.members.first()) {
            return message.reply("Please always mention whomever you want to kick")
                .then(m => m.delete( {timeout: 5000} ));
        }

        // No author permissions
        if (!message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id === admin).id)) {
            if (!message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id === moderator).id)) {
                return message.reply("❌ You do not have permissions to kick members. Please contact a staff member")
                    .then(m => m.delete({ timeout: 5000 }));
            }
        }

        const toKick_collection = args.slice(0);
        toKick_collection.forEach(function(person) {            

            var chnl = Array.from(person)                      
                
            if (chnl.includes("@")) {
                b = chnl.slice(3, chnl.indexOf(">"))
                var mbr = b.join("")
            } else {
                var mbr2 = message.guild.roles.cache.find(r => r.name === chnl.join(""));
                var mbr = mbr2.id;
            }

            const toKick = message.guild.members.cache.find(m => m.id === mbr)
            
            // No member found
            if (!toKick) {
                return message.reply("Couldn't find that member, try again")
                    .then(m => m.delete({ timeout: 5000 }));
            }

            // person to remove = author
            if (toKick.id === message.author.id) {
                return message.reply("You can't do that to yourself smartboi :rofl:")
                    .then(m => m.delete({ timeout: 5000 }));
            }

            // Check if the user's kickable
            if (!toKick.kickable) {
                return message.reply("I can't kick that person due to role hierarchy, I suppose.")
                    .then(m => m.delete({ timeout: 5000 }));
            }

            //no bot permission
            if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
                return message.reply("❌ I do not have permissions to kick members. Please contact a staff member")
                    .then(m => m.delete({ timeout: 5000 }));
            }

            const embed = new Discord.MessageEmbed()
                .setColor("#ff0000")
                .setThumbnail(toKick.user.displayAvatarURL())
                .setFooter(message.member.displayName, message.author.displayAvatarURL())
                .setTimestamp()
                .setDescription(stripIndents`**- Kicked member:** ${toKick} (${toKick.id})
            **- Kicked by:** ${message.member} (${message.member.id})`);

            toKick.kick()
                .catch(err => {
                    if (err) return message.channel.send(`Well.... the kick didn't work out. Here's the error ${err}`)
                });

            return logChannel.send(embed);
        })
        

        
    }
}