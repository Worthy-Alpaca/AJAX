const { setservergreeting } = require("../../functions/setupfunctions.js");
const Discord  = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "setservergreeting",    
    category: "setup",
    permission: ["admin"],
    description: "Sets the message that is to be displayed to the rest of the server",    
    run: async (client, message, args, con) => {
        if (!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply("You are not powerful enough to do that");
        }
        member = message.member;

        const embed4 = new Discord.MessageEmbed()
            .setColor(member.displayHexColor === "#000000" ? "#ffffff" : member.displayHexColor)
            .setTimestamp()
            .setDescription(`Please enter the greeting that is to be displayed to the server.`)
            .addField(`**Example**`, stripIndents`<Member> [Your message here]`);

        return setservergreeting(message, con, embed4);

    }
}