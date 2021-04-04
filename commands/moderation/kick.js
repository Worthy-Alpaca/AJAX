const Discord = require('discord.js');
const { stripIndents } = require('common-tags');
const { filter_integer } = require('../../functions/functions.js');


module.exports = {
	name: 'kick',
	category: 'moderation',
	permission: ['moderator', 'admin'],
	description: 'Kicks all the members you mention',
	usage: '<member> [member] etc.',
	run: async (client, message, args, api) => {
		//const reports = await getreportschannel(message);
		const logChannel = message.guild.channels.cache.find(c => c.id === api.reports) || message.channel; //###########################

        

		if (api.admin === null) { //###########################
			return message.channel.send('You need to set the role for admin first. Do that by typing !setadmin');
		}
		if (api.moderator === null) { //###########################
			return message.channel.send('You need to set the role for moderator first. Do that by typing !setmod');
		}

		// No args
		if (!args[0] || !message.mentions.members.first()) {
			return message.reply('Please always mention whomever you want to kick');
		}

		const toKick_collection = args.slice(0);
		toKick_collection.forEach(async function (person) {

			const mbr = await filter_integer(message, person);

			const toKick = message.guild.members.cache.find(m => m.id === mbr);

			// No member found
			if (!toKick) {
				return message.reply('Couldn\'t find that member, try again');
			}

			// person to remove = author
			if (toKick.id === message.author.id) {
				return message.reply('You can\'t do that to yourself smartboi :rofl:');
			}

			// Check if the user's kickable
			if (!toKick.kickable) {
				return message.reply('I can\'t kick that person due to role hierarchy, I suppose.');
			}

			//no bot permission
			if (!message.guild.me.hasPermission('KICK_MEMBERS')) {
				return message.reply('❌ I do not have permissions to kick members. Please contact a staff member');
			}

			const embed = new Discord.MessageEmbed()
				.setColor('#ff0000')
				.setThumbnail(toKick.user.displayAvatarURL())
				.setFooter(message.member.displayName, message.author.displayAvatarURL())
				.setTimestamp()
				.setDescription(stripIndents`**- Kicked member:** ${toKick} (${toKick.id})
            **- Kicked by:** ${message.member} (${message.member.id})`);

			toKick.kick()
				.catch(err => {
					if (err) return message.channel.send(`Well.... the kick didn't work out. Here's the error ${err}`);
				});

			return logChannel.send(embed);
		});



	}
};