module.exports = {
	name: 'stop',
	category: 'music',
	aliases: ['s'],
	permission: ['none', 'moderator', 'admin'],
	description: 'Stops the music',
	usage: '<link>',
	run: async (client, message, args, api) => {
		const queue = client.queue;
		const serverQueue = queue.get(message.guild.id);
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) return message.channel.send('You need to be in a voice channel to stop the music!');
		serverQueue.songs = [];
		message.channel.send('⏹ **Music stopped**');
		serverQueue.connection.dispatcher.end();
	}
};