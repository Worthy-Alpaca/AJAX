const Discord  = require("discord.js");
const randomPuppy = require("random-puppy");

module.exports = {
    name: "meme",
    category: "fun",
    permission: ["none", "moderator", "admin"],
    description: "Sends an epic meme",
    run: async (client, message, args, con) => {

        
        var channel = message.guild.channels.cache.find(channel => channel.name === "memes");
        if (!channel) {
            channel = message.channel;
        }

        if (message.deletable) message.delete();
        // In this array, 
        // you can put the subreddits you want to grab memes from
        const subReddits = ["dankmeme", "meme", "me_irl", "funny"];
        // Grab a random property from the array
        const random = subReddits[Math.floor(Math.random() * subReddits.length)];

        // Get a random image from the subreddit page
        const img = await randomPuppy(random);
        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setImage(img)
            .setTitle(`From /r/${random}`)
            .setURL(`https://reddit.com/r/${random}`);

        return channel.send(embed);
        
    }
}