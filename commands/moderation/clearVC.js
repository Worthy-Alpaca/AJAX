/*eslint no-unused-vars: "off"*/

module.exports = {
	name: 'clearvc',
	category: 'moderation',
	permission: ['moderator', 'admin'],
	description: 'Clears a voice channel',
	usage: '<channel>',
	run: async (client, message, args, api) => {
		message.delete();

		if (api.admin === null) {  //###########################
			return message.channel.send('You need to set the role for admin first. Do that by typing !setadmin');
		}
		if (api.moderator === null) { //###########################
			return message.channel.send('You need to set the role for moderator first. Do that by typing !setmod');
		}

		if (!args[0]) {
			return message.reply('You need to tell me what channel to close down');
		}

		const mRole = args.slice(0);

		const channel = message.guild.channels.cache.find(channel => channel.name === mRole.join(' '));

		if (!channel) {
			return message.reply('That channel does not exist');
		}

		if (channel.type !== 'voice') {
			return message.reply('That is not a voice channel');
		}
		//console.log(channel.members.first().voice);
		for (const [memberID, member]of channel.members) {
			member.voice.setChannel(null)
				.catch(error => {
					message.reply(`Something went wrong. Error: ${error}`);
				});
		}


	}
};