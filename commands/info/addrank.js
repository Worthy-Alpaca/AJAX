const Discord = require("discord.js");
const { post_API_call } = require("../../functions/functions.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "addrank",
    category: "info",
    permission: ["admin"],
    description: "Adds a rank to the database",
    usage: "<rank>",
    run: async (client, message, args, api) => {
        if (args < 1) {
            return message.reply("If you give me some thing to work with, I might be able to help you :wink:").then(m => m.delete({ timeout: 5000 }));
        }
        //var admin = await getAdmin(message);
        if (!message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id === api.admin).id)) { //###########################
            return message.reply("You don't have the required permissions to do this.").then(m => m.delete({ timeout: 5000 }));
        }
        var rank = message.guild.roles.cache.find(r => r.name === args.slice(0).join(" "))

        const embed = new Discord.MessageEmbed()

        if (!rank) {
            embed.setColor("RED").setDescription("❌ This rank does not exist");
            return message.channel.send(embed);
        }

        const payload = JSON.stringify({
            guild: message.guild,
            value: rank
        })

        const done = await post_API_call('misc/create', payload, message.guild, 'misc/rank');

        if (done.success === true) {
            embed.setColor("GREEN").setDescription("✅ Rank was added successfully.");
            return message.channel.send(embed);
        } else if(done.success === false && done.status === 200) {
            embed.setColor("YELLOW").setDescription("❗ This rank already exists for this server");
            return message.channel.send(embed);
        } else {
            embed.setColor("RED").setDescription(`❗ An error occured: ${done.err}`);
            return message.channel.send(embed);
        }
    }
}