const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
const { version } = require("../../src/config.json");
const { get_API_call } = require("../../functions/functions.js");


module.exports = {
    name: "coc",
    category: "info",
    permission: ["none", "moderator", "admin"],
    description: "Returns the Code of Conduct for this server.",
    run: async (client, message, args, api) => {

        const coc = await get_API_call(message, 'misc/get', 'misc/coc');

        const embed = new Discord.MessageEmbed()
            .setTitle("**Code of Conduct**")
            .setFooter("Code of Conduct", client.user.displayAvatarURL())
            .setThumbnail(message.guild.iconURL())
            .setColor("RANDOM")
            .setTimestamp()

        let terms = [];
        if (message.member.hasPermission("ADMINISTRATOR")) {
            coc.forEach(elemet => {
                terms.push(`- ${elemet.coc} \`CoC-ID ${elemet.id}\``);
            })
            embed.setDescription(terms.join("\n"));
            embed.addField(`\u200b`, stripIndents`Use ${api.prefix}cocadd to add your own Code of Conduct`)
        } else {
            coc.forEach(elemet => {
                terms.push(`- ${elemet.coc}`);
            })
        }
        
        return message.reply(embed);
    }

}