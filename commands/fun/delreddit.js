const Discord = require("discord.js");
const { getAdmin, getMod, delreddit } = require("../../functions/db_queries.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "delreddit",
    category: "fun",
    permission: ["moderator", "admin"],
    description: "Deletes a subreddit from the database.",
    usage: "<reddit>",
    run: async (client, message, args, con) => {
        if (args < 1) {
            return message.reply("If you give me some thing to work with, I might be able to help you :wink:").then(m => m.delete({ timeout: 5000 }));
        }
        var admin = await getAdmin(message, con);
        var moderator = await getMod(message, con);
        if (!message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id === admin).id)) {
            if (!message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id === moderator).id)) {
                return message.reply("You don't have the required permissions to do this.").then(m => m.delete({ timeout: 5000 }));
            }
        }
        reddit = args[0];
        if (reddit.startsWith("r/") || reddit.startsWith("https://reddit.com/r/")) {
            a = reddit.split("r/");
            reddit = a[1];
        } 

        const embed = new Discord.MessageEmbed()

        const done = await delreddit(message, reddit, con);

        if (done) {
            embed.setColor("GREEN").setDescription("✅ Subreddit was deleted successfully.");
            return message.channel.send(embed).then(m => m.delete({ timeout: 5000 }));
        } else {
            embed.setColor("YELLOW").setDescription("❗ This subreddit doesn't exist in my database");
            return message.channel.send(embed).then(m => m.delete({ timeout: 5000 }));
        }
    }
}