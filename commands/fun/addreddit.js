const Discord = require("discord.js");
const { getAdmin, getMod, addreddit } = require("../../functions/db_queries.js");
const { post_API_call } = require("../../functions/functions.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "addreddit",    
    category: "fun",
    permission: ["moderator", "admin"],
    description: "Adds a subreddit to be used with !meme",
    usage: "<subreddit>",
    run: async (client, message, args, api) => {
        if (args < 1) {
            return message.reply("If you give me some thing to work with, I might be able to help you :wink:");
        }
        
        var reddit = args[0];
        if (reddit.startsWith("r/") || reddit.startsWith("https://reddit.com/r/") || reddit.startsWith("/r/")) {
            a = reddit.split("r/");
            reddit = a[1];             
        } 
        const embed = new Discord.MessageEmbed()

        const payload = JSON.stringify({
            guild: message.guild,            
            value: reddit
        })

        const done = await post_API_call('misc/create', payload, message.guild, 'misc/reddit');

        if (done.success === true) {
            embed.setColor("GREEN").setDescription("✅ Subreddit was added successfully.");
            return message.channel.send(embed);
        } else if(done.success === false && done.status === 200) {
            embed.setColor("YELLOW").setDescription("❗ This subreddit already exists for this server");
            return message.channel.send(embed);
        } else {
            embed.setColor("RED").setDescription(`❗ An error occured: ${done.err}`);
            return message.channel.send(embed);
        }
    }
}