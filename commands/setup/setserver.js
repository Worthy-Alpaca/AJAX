const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { setadm, setmd, setch, setms, setapr, setcmd, setDB } = require("../../functions/setupfunctions.js");
const { getAdmin, getMod, getChnl, getMsg, getapproved } = require("../../functions/functions.js");


module.exports = {
    name: "setserver",
    category: "setup",
    description: "Set up the entire server",
    run: async (client, message, args, con) => {
        
        if (!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply("You are not powerfull enough to do that");
        }       
        
        //declaring stuff
        const member = message.member;
        const guild = message.member.guild;                    
        var md2;
        var ch2;
        var ms2;
        var apr2;
        var cmd2;        
        
        
        //setup complete message
        const embed = new RichEmbed()
            .setColor(member.displayHexColor === "#000000" ? "#ffffff" : member.displayHexColor)
            .setTimestamp()
            .setDescription(stripIndents`You have completed the setup process for this server. :partying_face:
            Hopefully nothing broke :sweat_smile:
            If you wish to change any of this in the future, you can use one of the other commands in the \`setup\` category.`)
        
        
        
        
        //set admin role
        
        const adm2 = await setadm(message, con);
        
        //set moderator role
        if (adm2) {
            md2 = await setmd(message, con);
        }
        //set welcome channel
        if (md2) {
            ch2 = await setch(message, con);
        }
        //set welcome message
        if (ch2) {
            ms2 = await setms(message, con);
        }
        //set approved role
        if (ms2) {
            apr2 = await setapr(message, con);
        }
        //set approving command
        if (apr2) {
            cmd2 = await setcmd(message, con);
        }
        
        if (cmd2) {
        console.log("bingo")
        const admin2 = await getAdmin(message, con);
        const moderator2 = await getMod(message, con);
        const welcomechannel2 = await getChnl(member, con);
        const approvedrole2 = await getapproved(member, con);
        admin = message.guild.roles.find(r => r.id === admin2);
        moderator = message.guild.roles.find(r => r.id === moderator2);
        welcomechannel = message.guild.channels.find(c => c.id === welcomechannel2);
        welcomemessage = await getMsg(member, con);
        approvedrole = message.guild.roles.find(r => r.id === approvedrole2);
        startcmd = await getstartcmd(message, con);
        }

        const embed2= new RichEmbed()
            .setColor(member.displayHexColor === "#000000" ? "#ffffff" : member.displayHexColor)
            .setTimestamp()
            .setDescription(stripIndents`This is what you entered`)
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
            .addField(`\u200b`, stripIndents`**Command for approving new members**
            ${startcmd}`, true)

        if (cmd2) {
            message.channel.bulkDelete(14, true)
                .then(message.channel.send(embed))
                .then(message.channel.send(embed2));
        }
        

    }
}