const Discord = require('discord.js');
const { filter_integer } = require('../../functions/functions.js');

module.exports = {
	name: 'say',
	aliases: ['bc', 'broadcast'],
	category: 'moderation',
	permission: ['admin'],
	description: 'Let the bot speak on your behalf',
	descriptionlong: 'Let the bot speak on your behalf. Can be used across channels and also send an embed',
	usage: '[channel] [embed] <input>',
	run: async (client, message, args, api) => {
		message.delete();

		if (api.admin === null) { //###########################
			return message.channel.send('You need to set the role for admin first. Do that by typing !setadmin');
		}
		if (api.moderator === null) { //###########################
			return message.channel.send('You need to set the role for moderator first. Do that by typing !setmod');
		}

		if (typeof args[0] == 'undefined') {
			return message.channel.send('Maybe include something :wink:');
		}

		const chnl = await filter_integer(message, args[0]);

		const channel = message.guild.channels.cache.find(channel => channel.id === chnl); //###########################

		if (channel) {
			if (typeof args[1] == 'undefined') {
				return message.channel.send('Maybe include a message :wink:');
			}
		}

		if (!channel) {
			if (args[0].toLowerCase() === 'embed') {
				const embed = new Discord.MessageEmbed()
					.setDescription(args.slice(1).join(' '))
					.setColor('RANDOM');

				message.channel.send(embed);
			} else {
				message.channel.send(args.slice(0).join(' '));
			}
		} else {
			if (args[1].toLowerCase() === 'embed') {
				const embed = new Discord.MessageEmbed()
					.setDescription(args.slice(2).join(' '))
					.setColor('RANDOM');

				channel.send(embed);
			} else {
				channel.send(args.slice(1).join(' '));
			}
		}
	}
};
