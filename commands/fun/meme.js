const Discord = require("discord.js");
const randomPuppy = require("random-puppy");
const { post_API_call, get_API_call } = require("../../functions/functions.js");

module.exports = {
    name: "meme",
    category: "fun",
    permission: ["none", "moderator", "admin"],
    description: "Sends an epic meme",
    run: async (client, message, args, con) => {


        var channel = message.guild.channels.cache.find(channel => channel.name.includes("memes"));
        if (!channel) {
            channel = message.channel;
        }
        var mp4 = false;
        if (message.deletable) message.delete();
        
        const reddits = await get_API_call(message, 'misc/get', 'misc/reddit');

        if (!reddits) {
            var subReddits = ["dankmeme", "meme", "me_irl", "funny"];
            subReddits.forEach(async reddit => {
                const payload = JSON.stringify({
                    guild: message.guild,
                    value: reddit
                })

                await post_API_call('misc/create', payload, message.guild, 'misc/reddit');
            })
        } else {
            var subReddits = reddits;
        }
                
        //check if file ends in .mp4 and get a new one if it does
        while (mp4 === false) {
            var random = subReddits[Math.floor(Math.random() * subReddits.length)];
            var img = await randomPuppy(random);  
            
            if (typeof img == 'undefined') {
                mp4 = false;
                continue;
            }
            
            if (!img.endsWith(".mp4")) {
                mp4 = true;
            }
        }

        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setImage(img)
            .setTitle(`From /r/${random}`)
            .setURL(`https://reddit.com/r/${random}`);

        return channel.send(embed);

    }
}