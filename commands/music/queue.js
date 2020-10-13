const Discord = require('discord.js');
const { convertSeconds } = require('../../functions/functions');

module.exports = {
    name: "queue",
    category: "music",
    aliases: ["q"],
    permission: ["none", "moderator", "admin"],
    description: "Displays the music queue",
    run: async (client, message, args, api) => {
        const queue = client.queue;
        const serverQueue = queue.get(message.guild.id);
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send("You need to be in a voice channel to play music!");
        if (!serverQueue) return message.channel.send(`There is currently no queue. You can use ${api.prefix}play to add something!`);
        
        const playing = serverQueue.songs.shift();
        
        const embed = new Discord.MessageEmbed()
            .setTitle(`Queue for ${message.guild.name}`)
            .setDescription(`Currently Playing:
            [${playing.title}](${playing.url}) | ${convertSeconds(playing.length)} Requested by ${playing.requester}`)
            .addField("Next in line",
                serverQueue.songs.map(song => `- [${song.title}](${song.url}) | ${convertSeconds(song.length)} Requested by ${song.requester}`));
        
        serverQueue.songs.unshift(playing);
        
        return message.channel.send(embed);
    }
}