const Discord = require("discord.js");
const { getAdmin, getMod, addreddit } = require("../../functions/db_queries.js");
const { stripIndents } = require("common-tags");
const { createPool } = require("mysql");

module.exports = {
    name: "addreddit",    
    category: "fun",
    permission: ["moderator", "admin"],
    description: "Adds a subreddit to be used with !meme",
    usage: "<subreddit>",
    run: async (client, message, args, con, api) => {
        if (args < 1) {
            return message.reply("If you give me some thing to work with, I might be able to help you :wink:").then(m => m.delete({ timeout: 5000 }));
        }
        /* var admin = await getAdmin(message, con);
        var moderator = await getMod(message, con); */
        if (!message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id === api.admin).id)) { //###########################
            if (!message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id === api.moderator).id)) { //###########################
                return message.reply("You don't have the required permissions to do this.").then(m => m.delete({ timeout: 5000 }));
            }
        }
        reddit = args[0];
        if (reddit.startsWith("r/") || reddit.startsWith("https://reddit.com/r/")) {
            a = reddit.split("r/");
            reddit = a[1];             
        } 
        const embed = new Discord.MessageEmbed()

        const done = await addreddit(message, reddit, con);

        if (done) {
            embed.setColor("GREEN").setDescription("✅ Subreddit was added successfully.");
            return message.channel.send(embed).then(m => m.delete({ timeout: 5000 }));
        } else {
            embed.setColor("YELLOW").setDescription("❗ This subreddit already exists for this server");
            return message.channel.send(embed).then(m => m.delete({ timeout: 5000 }));
        }
    }
}