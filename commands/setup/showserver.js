const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getAdmin, getMod, getChnl, getMsg, getapproved, getstartcmd } = require("../../functions/functions.js");

module.exports = {
    name: "showserver",
    category: "setup",
    description: "Shows the server setup result",
    run: async (client, message, args, con) => {
        
        if (!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply("You are not powerfull enough to do that");
        }
                
        const member = message.member; 
        const guild = message.member.guild;
        const admin2 = await getAdmin(message, con);
        const moderator2 = await getMod(message, con);
        const welcomechannel2 = await getChnl(member, con);
        const approvedrole2 = await getapproved(member, con);
        const admin = message.guild.roles.find(r => r.id === admin2);
        const moderator = message.guild.roles.find(r => r.id === moderator2);
        const welcomechannel = message.guild.channels.find(c => c.id === welcomechannel2);
        const welcomemessage = await getMsg(member, con);
        const approvedrole = message.guild.roles.find(r => r.id === approvedrole2);
        const startcmd = await getstartcmd(message, con);

        const embed2= new RichEmbed()
            .setColor(member.displayHexColor === "#000000" ? "#ffffff" : member.displayHexColor)
            .setThumbnail(guild.displayAvatarURL)
            .setTimestamp()
            .setFooter(message.guild.name)
            .setDescription(stripIndents`**This is what you entered**`)
            .addField(`\u200b`, stripIndents`**Admin role**
            ${admin}`, true)
            .addField(`\u200b`, stripIndents`**Moderator role**
            ${moderator}`, true)
            .addField(`\u200b`, stripIndents`**Welcome channel**
            ${welcomechannel}`, true)
            .addField(`\u200b`, stripIndents`**Welcome message**
            ${welcomemessage}`)
            .addField(`\u200b`, stripIndents`**Role for approved members**
            ${approvedrole}`, true)
            .addField(`\u200b`, stripIndents`**command for approving new members**
            ${startcmd}`, true);

        return message.channel.send(embed2);
        
    }
}