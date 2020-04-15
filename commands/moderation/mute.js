
const Discord = require("discord.js");
const { RichEmbed } = require('discord.js');
const { stripIndents } = require("common-tags");

module.exports = {
    name: "mute",
    category: "moderation",
    description: "mutes a person",
    usage: "<id | mention>",
    run: async (client, message, args) => {


        if (message.deletable) message.delete();
        const report = message.guild.channels.find(channel => channel.name === "reports");
        const mutee = message.mentions.members.first();
        
        if (!message.member.hasPermission("KICK_MEMBERS")) {
            return message.reply("You can't do that. Please contact a staff member!")
                .then(m => m.delete(5000));
        }


        if (!args[0]) {
            return message.reply("You need to tag someone.")
                .then(m => m.delete(5000));
        }

        const embed = new RichEmbed() 
            .setColor("#ff0000")
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL)
            .setAuthor("Muted member", mutee.user.displayAvatarURL)
            .setDescription(stripIndents`**> Member: ${mutee} (${mutee.id})
            **> Automated Mute
            **> Muted in: ${message.channel}
            **> Reason: SPAM
            MUTE needs to be manually removed`);

        
        let muterole = message.guild.roles.find(r => r.name === "Muted")
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
        const unmuted = new RichEmbed()
                .setDescription(`${mutee} you have been unmuted`)
                .setColor("RANDOM");

        const muted = new RichEmbed()
                .setDescription(`${mutee} you have been muted`)
                .setColor("RANDOM");
        

               
        if (mutee.roles.has(muterole.id)) {
            await mutee.removeRole(muterole)
            message.channel.send(unmuted);
        } else {
            await mutee.addRole(muterole)
            message.channel.send(muted);
            report.send(embed);
        }



    }
}