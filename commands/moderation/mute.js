const Discord = require('discord.js');
const { stripIndents } = require('common-tags');
const { filter_integer } = require('../../functions/functions.js');

module.exports = {
	name: 'mute',
	category: 'moderation',
	permission: ['moderator', 'admin'],
	description: 'mutes a person',
	usage: '<id | mention>',
	run: async (client, message, args, api) => {

        

		const report = message.guild.channels.cache.find(channel => channel.id === api.reports);

		if (api.admin === null) { //###########################
			return message.channel.send('You need to set the role for admin first. Do that by typing !setadmin');
		}
		if (api.moderator === null) { //###########################
			return message.channel.send('You need to set the role for moderator first. Do that by typing !setmod');
		}

		if (!args[0] || !message.mentions.members.first()) {
			return message.reply('You need to tag someone.');
		}

		const toMute_collection = args.slice(0);

		let muterole = message.guild.roles.cache.find(r => r.name === 'Muted');
		if (!muterole) {
			try {
				muterole = await message.guild.roles.create({
					data: {
						name: 'Muted',
						color: '#514f48',
						permissions: []
					}
				});
				message.guild.channels.cache.forEach(async (channel, id) => {
					await channel.updateOverwrite(muterole, {
						SEND_MESSAGES: false,
						SPEAK: false,
						ADD_REACTIONS: false,
						SEND_TTS_MESSAGES: false,
						ATTACH_FILES: false
					});
				});
			} catch (e) {
				console.log(e.stack);
			}
		}

		toMute_collection.forEach(async function (person) {
			const mbr = await filter_integer(message, person);

			const mutee = message.guild.members.cache.find(m => m.id === mbr);

			if (!mutee) {
				return message.reply('Couldn\'t find that member, try again');
			}

			if (mutee.user.bot) {
				return message.reply('You cannot mute a bot');
			}

			if (mutee.roles.cache.has(message.guild.roles.cache.find(r => r.id === api.admin).id)) { //###########################
				return message.reply('You cannot mute a server admin');
			}

			const embed = new Discord.MessageEmbed()
				.setColor('#ff0000')
				.setTimestamp()
				.setFooter(message.guild.name, message.guild.iconURL)
				.setAuthor('Muted member', mutee.user.displayAvatarURL())
				.setDescription(stripIndents`**> Member: ${mutee} (${mutee.id})
                **> Manual Mute
                **> Muted in: ${message.channel}
                **> Reason: probably a good one
                MUTE needs to be manually removed`);



			if (mutee.roles.cache.has(muterole.id)) {
				message.channel.send(`${mutee} you have been unmuted`);
				await mutee.roles.remove(muterole);
				return report.send(`${mutee} has been unmuted`);
			} else {
				message.channel.send(`${mutee} you have been muted`);
				await mutee.roles.add(muterole);
				report.send('@here someone has been muted');
				return report.send(embed);
			}
		});

	}
};