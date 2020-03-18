const { RichEmbed } = require("discord.js");
const randomPuppy = require("random-puppy");

module.exports = {
    name: "meme",
    category: "fun",
    description: "Sends an epic meme",
    run: async (client, message, args) => {

        
        const channel = message.guild.channels.find(channel => channel.name === "memes");
        if (!channel)
            return;

        if (message.deletable) message.delete();
            // In this array, 
            // you can put the subreddits you want to grab memes from
            const subReddits = ["dankmeme", "meme", "me_irl", "gifs"];
            // Grab a random property from the array
            const random = subReddits[Math.floor(Math.random() * subReddits.length)];

            // Get a random image from the subreddit page
            const img = await randomPuppy(random);
            const embed = new RichEmbed()
                .setColor("RANDOM")
                .setImage(img)
                .setTitle(`From /r/${random}`)
                .setURL(`https://reddit.com/r/${random}`);

            return channel.send(embed);

        
    }
}