module.exports = {
	name: 'skip',
	category: 'music',
	aliases: ['s'],
	permission: ['none', 'moderator', 'admin'],
	description: 'Skips a track',
	run: async (client, message, args, api) => {
		const queue = client.queue;
		const serverQueue = queue.get(message.guild.id);
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
		if (!serverQueue) return message.channel.send('There is no song that I could skip!');
		message.channel.send('⏩ **Song skipped**');
		serverQueue.connection.dispatcher.end();
	}
};