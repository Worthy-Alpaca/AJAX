const fetch = require('node-fetch');
const { post_API_call, get_API_call } = require("../../functions/functions.js");

module.exports = {
    name: "meme",
    category: "fun",
    permission: ["none", "moderator", "admin"],
    description: "Sends an epic meme",
    run: async (client, message, args) => {


        var channel = message.guild.channels.cache.find(channel => channel.name.includes("memes"));
        if (!channel) {
            channel = message.channel;
        }
        var mp4 = false;
        if (message.deletable) message.delete();

        const reddits = await get_API_call(message, 'misc/get', 'misc/reddit');

        if (reddits === null) {
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

        var random = subReddits[Math.floor(Math.random() * subReddits.length)];
        var img = await fetch(`https://www.reddit.com/r/${random}/hot.json`, {
            method: "GET"
        }).then(res => {
            return res.json();
        })
        
        while (mp4 === false) {
            var randimg = img.data.children[Math.ceil(img.data.children.length * Math.random())].data.url;

            if (typeof randimg == 'undefined') {
                mp4 = false;
                continue;
            }

            if (!randimg.endsWith(".mp4")) {
                mp4 = true;
            }
        }

        return channel.send(randimg);

    }
}