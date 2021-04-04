const Discord = require('discord.js');
const { stripIndents } = require('common-tags');
const { formatDate } = require('../../functions/functions.js');


module.exports = {
	name: 'whois',
	aliases: ['whoami'],
	category: 'info',
	permission: ['none', 'moderator', 'admin'],
	description: 'Returns user information',
	usage: '[username | id, | mention]',

	run: async (client, message, args) => {
		const member = message.mentions.members.first() || message.member;

		//member variables
		const joined = formatDate(member.joinedAt);
		const roles = member.roles.cache
			.filter(r => r.id !== message.guild.id)
			.map(r => r)
			.join(', ') || 'none';

		//user variables
		const created = formatDate(member.user.createdAt);

		const embed = new Discord.MessageEmbed()
			.setFooter(member.displayName, member.user.displayAvatarURL())
			.setThumbnail(member.user.displayAvatarURL())
			.setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor)
			.addField('**Member information**', stripIndents`**> Display name** ${member.displayName}
            **> Joined at:** ${joined}
            **> Roles:** ${roles}`, true)
			.addField('**User Information**', stripIndents`**> ID:** ${member.user.id}
            **> Username:** ${member.user.username}
            **> Discord Tag:** ${member.user.tag}
            **> Created at:** ${created}`, true)
			.setTimestamp();


		if (member.user.presence.activities[0])
			embed.addField(`Currently ${member.user.presence.activities[0].type.toLowerCase()}`, `${member.user.presence.activities[0].name}`);

		message.channel.send(embed);

	}

};