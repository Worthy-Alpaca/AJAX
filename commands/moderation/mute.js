const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
const { getAdmin, getMod } = require("../../functions/functions.js");

module.exports = {
    name: "mute",
    category: "moderation",
    description: "mutes a person",
    usage: "<id | mention>",
    run: async (client, message, args, con) => {


        if (message.deletable) message.delete();
        const report = message.guild.channels.cache.find(channel => channel.name === "reports");
        const mutee = message.mentions.members.first();
        var admin = await getAdmin(message, con);
        var moderator = await getMod(message, con);

        if (admin === null) {
            return message.channel.send("You need to set the role for admin first. Do that by typing !setadmin")
        }
        if (moderator === null) {
            return message.channel.send("You need to set the role for moderator first. Do that by typing !setmod")
        }
          
        if (!message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id=== admin).id)) {
            if (!message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id=== moderator).id)) {
                return message.reply("You can't do that. Please contact a staff member!")
                    .then(m => m.delete( {timeout: 5000} ));
            }
        }

        if (!args[0]) {
            return message.reply("You need to tag someone.")
                .then(m => m.delete( {timeout: 5000} ));
        }

        const embed = new Discord.MessageEmbed() 
            .setColor("#ff0000")
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL)
            .setAuthor("Muted member", mutee.user.displayAvatarURL())
            .setDescription(stripIndents`**> Member: ${mutee} (${mutee.id})
            **> Automated Mute
            **> Muted in: ${message.channel}
            **> Reason: SPAM
            MUTE needs to be manually removed`);

        
        let muterole = message.guild.roles.cache.find(r => r.name === "Muted")
        if(!muterole) {
            try{
                muterole = await message.guild.createRole({
                    name: "Muted",
                    color: "#514f48",
                    permissions: []
                })
            message.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(muterole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                    SEND_TTS_MESSAGES: false,
                    ATTACH_FILES: false,
                    SPEAK: false
                })
            })
            } catch(e) {
            console.log(e.stack);
            }   
        }
        const unmuted = new Discord.MessageEmbed()
                .setDescription(`${mutee} you have been unmuted`)
                .setColor("RANDOM");

        const muted = new Discord.MessageEmbed()
                .setDescription(`${mutee} you have been muted`)
                .setColor("RANDOM");
        

               
        if (mutee.roles.cache.has(muterole.id)) {
            await mutee.roles.remove(muterole)
            message.channel.send(unmuted);
            report.send(`${mutee} has been unmuted`);
        } else {
            await mutee.roles.add(muterole)
            message.channel.send(muted);
            report.send("@here someone has been muted");
            report.send(embed);
        }



    }
}