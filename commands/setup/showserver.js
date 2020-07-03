const Discord  = require("discord.js");
const { stripIndents } = require("common-tags");
var { prefix } = require("../../src/config.json")
const { getAdmin, getMod, getChnl, getMsg, getapproved, getstartcmd, getreportschannel, getautoapproved, getservergreeting, getprefix } = require("../../functions/db_queries.js");

module.exports = {
    name: "showserver",
    category: "setup",
    permission: ["admin"],
    description: "Shows the server setup result",
    run: async (client, message, args, con) => {
        
        if (!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply("You are not powerful enough to do that");
        }
                
        const member = message.member; 
        const guild = message.member.guild;
        const admin2 = await getAdmin(message, con);
        const moderator2 = await getMod(message, con);
        const welcomechannel2 = await getChnl(member, con);
        const approvedrole2 = await getapproved(member, con);
        const reportschannel2 = await getreportschannel(message, con);
        const admin = message.guild.roles.cache.find(r => r.id === admin2);
        const moderator = message.guild.roles.cache.find(r => r.id === moderator2);
        const welcomechannel = message.guild.channels.cache.find(c => c.id === welcomechannel2);
        const welcomemessage = await getMsg(member, con);
        const servergreeting = await getservergreeting(member, con);
        const approvedrole = message.guild.roles.cache.find(r => r.id === approvedrole2);
        var startcmd = await getstartcmd(message, con);
        reportschannel = message.guild.channels.cache.find(c => c.id === reportschannel2);
        const bolean = await getautoapproved(member, con);
        const custom_prefix = await getprefix(message, con);

        if (custom_prefix !== null) {
            prefix = custom_prefix;
        }

        if (bolean === "true") {
            startcmd = "Members get role automatically"
        }
        
        const embed2= new Discord.MessageEmbed()
            .setColor(member.displayHexColor === "#000000" ? "#ffffff" : member.displayHexColor)            
            .setTimestamp()
            .setThumbnail(guild.iconURL())
            .setFooter(message.guild.name)
            .setDescription(stripIndents`**This is what you entered**`)
            .addField(`\u200b`, stripIndents`**Admin role**
            \`${admin}\``, true)
            .addField(`\u200b`, stripIndents`**Moderator role**
            \`${moderator}\``, true)
            .addField(`\u200b`, stripIndents`**Welcome channel**
            \`${welcomechannel}\``, true)
            .addField(`\u200b`, stripIndents`**Welcome message**
            \`${welcomemessage}\``)
            .addField(`\u200b`, stripIndents`**Servergreeting message**
            \`${servergreeting}\``)
            .addField(`\u200b`, stripIndents`**Role for approved members**
            \`${approvedrole}\``, true)
            .addField(`\u200b`, stripIndents`**Command for approving new members**
            \`${startcmd}\``, true)
            .addField(`\u200b`, stripIndents`**Channel for your reports**
            \`${reportschannel}\``, true)
            .addField(`\u200b`, stripIndents`**Your prefix**
            \`${prefix}\``, true);

        return message.channel.send(embed2);
        
    }
}