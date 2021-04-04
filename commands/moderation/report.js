const Discord = require('discord.js');
const { stripIndents } = require('common-tags');
const { get_API_call, post_API_call, update_API_call } = require('../../functions/functions.js');
var { ban_limit, kick_limit } = require('../../src/config.json');


module.exports = {
	name: 'report',
	category: 'moderation',
	permission: ['none', 'moderator', 'admin'],
	description: 'reports a member',
	usage: '<good/bad, mention | id, reason>',
	run: async (client, message, args, api) => {
        

		let rMember = message.mentions.members.first() || message.guild.members.get(args[0]);

		let behavior;
		let behavior2;
		const channel = message.guild.channels.cache.find(c => c.id === api.reports) || message.channel; //###########################
		const tblid = Array.from(message.guild.name);
		tblid.forEach(function (item, i) { if (item == ' ') tblid[i] = '_'; });

		if (api.admin === null) {
			return message.channel.send('You need to set the role for admin first. Do that by typing !setadmin');
		}
		if (api.moderator === null) {
			return message.channel.send('You need to set the role for moderator first. Do that by typing !setmod');
		}

		if (!channel)
			return message.channel.send('I could not find a `#reports` channel').then(m => m.delete({ timeout: 10000 }));

		if (!rMember)
			return message.reply('Couldn\'t find that person');

		if (rMember.roles.cache.has(message.guild.roles.cache.find(r => r.id === api.admin).id) || rMember.user.bot) //###########################
			return message.reply('Can\'t report that member');

		if (args[0] === 'good') {
			behavior = 'Keep up the good work!';
			behavior2 = 'good';
		} else if (args[0] === 'bad') {
			behavior = 'Please cease this behavior immediatly. If you think this is wrong, please contact a staff member.';
			behavior2 = 'bad';
			const infractions = await get_API_call(message, 'misc/get', 'misc/infractions', tblid.join(''), rMember.id);
			console.log(infractions);
			if (infractions > 0) {
				const payload = JSON.stringify({
					server: tblid.join(''),
					value: rMember
				});
				const success = await update_API_call('misc/update', payload, message.guild, 'misc/infractions');
				console.log(success);
			} else {
				const payload = JSON.stringify({
					server: tblid.join(''),
					value: rMember
				});
				const success = await post_API_call('misc/create', payload, message.guild, 'misc/infractions');
				console.log(success);
			}

		} else if ((args[0] !== 'good') || (args[0] !== 'bad')) {
			return message.reply('You need to add a behavior type. (Good/Bad)');
		}

		if (!args[2])
			return message.channel.send('Please include a reason for the report').then(m => m.delete({ timeout: 10000 }));



		const infractions = await get_API_call(message, 'misc/get', 'misc/infractions', tblid.join(''), rMember.id);

		if (api.ban_limit !== null) {
			ban_limit = api.ban_limit;
		}

		if (api.kick_limit !== null) {
			kick_limit = api.ban_limit;
		}

		let msg = `You have been reported for "${args.slice(2).join(' ')}." ${behavior} This message was computer generated. Please do not answer to it.`;

		const embed = new Discord.MessageEmbed()
			.setColor('#ff0000')
			.setTimestamp()
			.setFooter(message.guild.name, message.guild.iconURL)
			.setAuthor('Reported Member', rMember.user.displayAvatarURL());

		if (args[0] === 'good') {
			embed.setDescription(stripIndents`**> Member:** ${rMember} (${rMember.id})
            > Behavior: ${behavior2}
            **> Reported by:** ${message.member} (${message.member.id})
            > Reported in: ${message.channel}
            **> Reason:** ${args.slice(2).join(' ')}
            > Current Infractions: \`${infractions}\``);
		} else {
			embed.setDescription(stripIndents`**> Member:** ${rMember} (${rMember.id})
            > Behavior: ${behavior2}
            **> Reported by:** ${message.member} (${message.member.id})
            > Reported in: ${message.channel}
            **> Reason:** ${args.slice(2).join(' ')}
            > Current Infractions: \`${infractions}\``);
		}

		if (infractions >= kick_limit && infractions < ban_limit) {
			rMember.kick(`Reported infractions have reached ${kick_limit}`)
				.catch(err => {
					if (err) return message.channel.send('That didn\'t work');
				});
			msg = `You have been kicked because you have been reported ${infractions} times for bad behavior. This message was computer generated. Please do not answer to it.`;
			embed.addField('\u200b', stripIndents`${rMember} has been kicked.`);
		} else if (infractions >= ban_limit) {
			rMember.ban({ days: infractions, reason: `Reported infractions have reached ${ban_limit}` })
				.catch(err => {
					if (err) return message.channel.send('That didn\'t work');
				});
			msg = `You have been banned for ${infractions} days because you have been reported ${infractions} times for bad behavior. This message was computer generated. Please do not answer to it.`;
			embed.addField('\u200b', stripIndents`${rMember} has been banned for \`${infractions}\` days.`);
		}

		client.users.fetch(`${rMember.id}`, false).then(user => {
			user.send(msg);
		});

		return channel.send(embed);


	}
};