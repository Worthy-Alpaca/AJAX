const Discord = require('discord.js');
const { stripIndents } = require('common-tags');


module.exports = {
	name: 'purge',
	category: 'moderation',
	permission: ['admin'],
	description: 'Kicks all members who don\'t have the approved role',

	run: async (client, message, args, api) => {
        

		if (!message.member.hasPermission('ADMINISTRATOR')) {
			return message.reply('You are not powerful enough to do that');
		}

		const guild = message.channel.guild;
		//const member = message.member;
		const reason = 'Too long without agreeing to the rules';
		channel = guild.channels.cache.find(channel => channel.id === api.channel); //###########################
		var name;
		var kicked = [];
		async function crtInvite(channel, member) {
			let invite = await channel.createInvite({ uses: 1 });

			client.users.fetch(member.id, false).then(user => {
				user.send(`You have been kicked because you did not consent to the rules of this server. You can use this invite ${invite} to come back.`);
			});
            
			await member.kick(reason)
				.catch(err => {
					if (err) return message.channel.send(`I couldn't kick ${member.displayName}. Here's the error ${err}`);
				});
		}

		guild.members.cache.forEach(member => {
			if (member.user.bot) return;
			if (member.roles.cache.has(message.guild.roles.cache.find(r => r.id === api.approved).id)) { //###########################
				return;
			} else {
				crtInvite(channel, member);
				name = member.displayName;
				kicked.push(name);
			}
		});



		const embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setFooter(message.guild.name)
			.setTimestamp()
			.setTitle('Purging the member list');


		if (kicked.length > 0) {
			embed.setDescription(`I purged ${kicked.length} members`)
				.addField('\u200b', stripIndents`**Purged members**
            - ${kicked.join('\n- ')}`, true);
		} else {
			embed.addField('\u200b', stripIndents`**Purged members**
            No members purged`, true);
		}

		return message.channel.send(embed);

	}

};