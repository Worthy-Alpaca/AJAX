const Discord = require("discord.js");
const { getAdmin, setrank } = require("../../functions/db_queries.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "addrank",
    category: "info",
    permission: ["admin"],
    description: "Adds a rank to the database",
    usage: "<rank>",
    run: async (client, message, args, con) => {
        if (args < 1) {
            return message.reply("If you give me some thing to work with, I might be able to help you :wink:").then(m => m.delete({ timeout: 5000 }));
        }
        var admin = await getAdmin(message, con);
        if (!message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id === admin).id)) {
            return message.reply("You don't have the required permissions to do this.").then(m => m.delete({ timeout: 5000 }));
        }
        rank = message.guild.roles.cache.find(r => r.name === args.slice(0).join(" "))

        const embed = new Discord.MessageEmbed()

        if (!rank) {
            embed.setColor("RED").setDescription("❌ This rank does not exist");
            return message.channel.send(embed).then(m => m.delete({ timeout: 5000 }));
        }

        const done = await setrank(message, rank, con);

        if (done) {
            embed.setColor("GREEN").setDescription("✅ Rank was added successfully.");
            return message.channel.send(embed).then(m => m.delete({ timeout: 5000 }));
        } else {
            embed.setColor("YELLOW").setDescription("❗ This rank already exists for this server");
            return message.channel.send(embed).then(m => m.delete({ timeout: 5000 }));
        }
    }
}