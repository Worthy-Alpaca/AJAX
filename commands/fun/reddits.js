const Discord = require("discord.js");
const { getreddits, addreddit } = require("../../functions/db_queries.js");
const { stripIndents } = require("common-tags");
var { prefix } = require("../../src/config.json");

module.exports = {
    name: "reddits",
    category: "fun",
    permission: ["none", "moderator", "admin"],
    description: "Shows available subreddits",
    descriptionlong: `Shows all custom subreddits that can be used with !meme`,

    run: async (client, message, args, con) => {
        
        const reddits = await getreddits(message, con);  
        var subReddits = ["dankmeme", "meme", "me_irl", "funny"];

        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setThumbnail(message.guild.iconURL())
            .setTimestamp()
            .setTitle("Available subreddits")
            .setDescription("Don't see a subreddit that you like? Let us know!");
            
        
        if (!reddits) {
            subReddits.forEach(async reddit => {                
                await addreddit(message, reddit, con);
            })
            embed.addField(`\u200b`, stripIndents`No custom subreddits on this server.
            Adding default subreddits:
            - ${subReddits.join(`\n- `)}`, true);
        } else {            
            embed.addField(`\u200b`, stripIndents`- ${reddits.join(`\n- `)}`, true);
        }

        return message.channel.send(embed);        
    }

}