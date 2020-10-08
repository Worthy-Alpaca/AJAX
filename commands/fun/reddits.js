const Discord = require("discord.js");
const { post_API_call, get_API_call } = require("../../functions/functions.js");
const { stripIndents } = require("common-tags");
var { prefix } = require("../../src/config.json");

module.exports = {
    name: "reddits",
    category: "fun",
    permission: ["none", "moderator", "admin"],
    description: "Shows available subreddits",
    descriptionlong: `Shows all custom subreddits that can be used with !meme`,

    run: async (client, message, args) => {
        
        const reddits = await get_API_call(message, 'misc/get', 'misc/reddit');
        var subReddits = ["dankmeme", "meme", "me_irl", "funny"];

        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setThumbnail(message.guild.iconURL())
            .setTimestamp()
            .setTitle("Available subreddits")
            .setDescription("Don't see a subreddit that you like? Let us know!");
            
        console.log(reddits)
        if (reddits.status === 200 && reddits.success === false) {
            subReddits.forEach(async reddit => {                
                const payload = JSON.stringify({
                    guild: message.guild,
                    value: reddit
                })

                await post_API_call('misc/create', payload, message.guild, 'misc/reddit');
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