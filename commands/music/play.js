const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const { convertSeconds } = require('../../functions/functions');
const client = require('../../src/client');
const queue = client.queue;

module.exports = {
	name: 'play',
	category: 'music',
	aliases: ['p'],
	permission: ['none', 'moderator', 'admin'],
	description: 'Starts the music in your VC',
	usage: '<link>',
	run: async (client, message, args, api) => {
        
		const serverQueue = queue.get(message.guild.id);
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
			return message.channel.send('I need the permissions to join and speak in your voice channel!');
		}
		if (!args[0]) return message.reply('There is no song that I could play!');

		if (!ytdl.validateURL(args[0])) {
			return message.reply('That is not a valid link!');
		}

		const songInfo = await ytdl.getInfo(args[0]);
		//console.log(songInfo.videoDetails)
		const song = {
			title: songInfo.videoDetails.title,
			url: songInfo.videoDetails.video_url,
			length: songInfo.videoDetails.lengthSeconds,
			requester: message.member,
			thumbnail: songInfo.videoDetails.thumbnail.thumbnails[0].url
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
				play(message.guild, queueContruct.songs[0], message, voiceChannel);
			} catch (err) {
				console.log(err);
				queue.delete(message.guild.id);
				return message.channel.send(err);
			}
		} else {
			serverQueue.songs.push(song);
			const embed = new Discord.MessageEmbed()
				.setTitle('Added to queue :notepad_spiral:')
				.setThumbnail(song.thumbnail)
				.setColor('RANDOM')
				.setTimestamp()
				.setDescription(`[${song.title}](${song.url})`)
				.addField('Length', convertSeconds(song.length));
			//.addField("Queue", serverQueue.songs.map(song => `- ${song.title}`));
			message.channel.send(embed);
		}

		async function play(guild, song, message, voiceChannel) {
			const serverQueue = queue.get(guild.id);
			if (!song) {
				serverQueue.voiceChannel.leave();
				queue.delete(guild.id);
				return;
			}
            
			const embed = new Discord.MessageEmbed()
				.setTitle('Now Playing 🎶')
				.setThumbnail(song.thumbnail)
				.setColor('RANDOM')
				.setTimestamp()
				.addField('Title', song.title, true)
				.addField('Length', convertSeconds(song.length));              

			const dispatcher = serverQueue.connection
				.play(ytdl(song.url))
				.on('finish', () => {
					serverQueue.songs.shift();
					play(guild, serverQueue.songs[0]);
				})
				.on('error', (error) => console.error(error));
			dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
            
			serverQueue.textChannel.send(embed);
            
		}

	}
};