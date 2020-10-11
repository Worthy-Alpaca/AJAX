const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const { playReact } = require('../../functions/functions');
const client = require('../../src/client');
const queue = client.queue;

module.exports = {
    name: "play",
    category: "fun",
    permission: ["none", "moderator", "admin"],
    description: "Starts the music in your VC",
    usage: "<link>",
    run: async (client, message, args, api) => {
        
        const serverQueue = queue.get(message.guild.id);
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send("You need to be in a voice channel to play music!");
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return message.channel.send("I need the permissions to join and speak in your voice channel!");
        }

        const songInfo = await ytdl.getInfo(args[0]);
        //console.log(songInfo.videoDetails)
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            length: songInfo.videoDetails.lengthSeconds
        };
        //console.log(serverQueue, 3)
        if (!serverQueue) {
            const queueContruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true,
            };

            queue.set(message.guild.id, queueContruct);

            queueContruct.songs.push(song);

            try {
                var connection = await voiceChannel.join();
                queueContruct.connection = connection;
                play(message.guild, queueContruct.songs[0], message);
            } catch (err) {
                console.log(err);
                queue.delete(message.guild.id);
                return message.channel.send(err);
            }
        } else {
            serverQueue.songs.push(song);
            const embed = new Discord.MessageEmbed()
                .setTitle("Current Queue")
                .setColor("RANDOM")
                .setTimestamp()
                .setDescription(`Added ${song.title} to the queue`)
                .setFooter("React below to stop of skip the song")
                .addField("Now playing", serverQueue.songs[0].title)
                .addField("Queue", serverQueue.songs.map(song => `- ${song.title}`));
            const m = await message.channel.send(embed);

            const validReactions = ["⏹", "▶"];

            for (const reaction of validReactions) await m.react(reaction);

            const filter = (reaction, user) => validReactions.includes(reaction.emoji.name);

            const reaction = await m.awaitReactions(filter, { max: 1, time: song.length *= 1000 })
                .then(collected => { return collected })

            if (reaction.first().emoji.name === validReactions[0]) {
                return stop(reaction.first().message, m);
            } else if (reaction.first().emoji.name === validReactions[1]) {
                return skip(reaction.first().message, m);
            }
        }

        async function play(guild, song, message) {
            const serverQueue = queue.get(guild.id);
            if (!song) {
                serverQueue.voiceChannel.leave();
                queue.delete(guild.id);
                return;
            }

            const embed = new Discord.MessageEmbed()
                .setTitle("Now Playing")
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter("React below to stop or skip the song")
                .addField(song.title, `Length: ${song.length}`);

            const dispatcher = serverQueue.connection
                .play(ytdl(song.url))
                .on("finish", () => {
                    serverQueue.songs.shift();
                    play(guild, serverQueue.songs[0]);
                })
                .on("error", (error) => console.error(error));
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

            const m = await serverQueue.textChannel.send(embed);
            const validReactions = ["⏹", "▶"];

            for (const reaction of validReactions) await m.react(reaction);

            const filter = (reaction, user) => validReactions.includes(reaction.emoji.name);

            const reaction = await m.awaitReactions(filter, { max: 1, time: song.length *= 1000 })
                .then(collected => {return collected})
            
            if (reaction.first().emoji.name === validReactions[0]) {
                return stop(reaction.first().message, m);
            } else if (reaction.first().emoji.name === validReactions[1]) {
                return skip(reaction.first().message, m);
            }
        }

        function stop(message, m) {
            console.log(message.member)
            //if (!message.member.voice.channel) return message.channel.send("You have to be in a voice channel to stop the music!");
            const serverQueue = queue.get(message.guild.id);
            m.delete();
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
        }

        function skip(message, m) {
            //if (!message.member.voice.channel) return message.channel.send("You have to be in a voice channel to stop the music!");
            const serverQueue = queue.get(message.guild.id);
            if (!serverQueue) return message.channel.send("There is no song that I could skip!");
            m.delete();            
            serverQueue.connection.dispatcher.end();
        }

    }
}