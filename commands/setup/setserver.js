const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getadm, getmd, getch, getms, getapr,getcmd } = require("../../functions/functions.js");


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
        var greeting;
        var cmd;
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
        
        
        const adm2 = await getadm(message, con);
        
        if (adm2) {
            md2 = await getmd(message, con);
        }

        if (md2) {
            ch2 = await getch(message, con);
        }

        if (ch2) {
            ms2 = await getms(message, con);
        }

        if (ms2) {
            apr2 = await getapr(message, con);
        }

        if (apr2) {
            cmd2 = await getcmd(message, con);
        }

        if (cmd2) {
            message.channel.send(embed);
        }
        

    }
}