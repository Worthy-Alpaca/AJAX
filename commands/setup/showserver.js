const Discord = require('discord.js');
const { stripIndents } = require('common-tags');
var { prefix, kick_limit, ban_limit } = require('../../src/config.json');
const { api } = require('../../src/client');

module.exports = {
	name: 'showserver',
	category: 'setup',
	permission: ['admin'],
	description: 'Shows the server setup result.',
	run: async (client, message, args, response) => {
		//message.delete();
		//console.log(response)
		if (!message.member.hasPermission('ADMINISTRATOR')) {
			return message.reply('You are not powerful enough to do that');
		}
        
		const admin = message.guild.roles.cache.find(r => r.id === response.admin);
		const moderator = message.guild.roles.cache.find(r => r.id === response.moderator);
		const welcomechannel = message.guild.channels.cache.find(c => c.id === response.channel);
		const welcomemessage = response.greeting;
		const servergreeting = response.server_greeting;
		const approvedrole = message.guild.roles.cache.find(r => r.id === response.approved);
		var startcmd = response.startcmd;
		const reportschannel = message.guild.channels.cache.find(c => c.id === response.reports);
		const bolean = response.auto_approved;
		const custom_prefix = response.prefix;
		var custom_kicklimit = response.kick_limit;
		var custom_banlimit = response.ban_limit;
		var togglegreeting = 'Welcome message will be sent to new members';

		if (custom_banlimit !== null) {
			ban_limit = custom_banlimit;
		}

		if (custom_kicklimit !== null) {
			kick_limit = custom_kicklimit;
		}

		if (custom_prefix !== null) {
			prefix = custom_prefix;
		}

		if (bolean === 'true') {
			startcmd = 'Members get role automatically';
		}

		if (api.togglegreeting === 'true') {
			togglegreeting = 'Welcome message will not be sent to new members';
		}

		const embed2 = new Discord.MessageEmbed()
			.setColor(message.member.displayHexColor === '#000000' ? '#ffffff' : message.member.displayHexColor)
			.setTimestamp()
			.setThumbnail(message.guild.iconURL())
			.setFooter(message.guild.name)
			.setDescription(stripIndents`**This is what you entered**`)
			.addField('\u200b', stripIndents`**Admin role**
            ${admin}`, true)
			.addField('\u200b', stripIndents`**Moderator role**
            ${moderator}`, true)
			.addField('\u200b', stripIndents`**Welcome channel**
            ${welcomechannel}`, true)
			.addField('\u200b', stripIndents`**Welcome message**
            ${welcomemessage}`)
			.addField('\u200b', stripIndents`**Servergreeting message**
            ${servergreeting}`)
			.addField('\u200b', stripIndents`**Role for approved members**
            ${approvedrole}`, true)
			.addField('\u200b', stripIndents`**Command for approving new members**
            \`${startcmd}\``, true)
			.addField('\u200b', stripIndents`**Channel for your reports**
            ${reportschannel}`, true)
			.addField('\u200b', stripIndents`**Your prefix**
            \`${prefix}\``, true)
			.addField('\u200b', stripIndents`**Your Kick-Limit**
            \`${kick_limit}\``, true)
			.addField('\u200b', stripIndents`**Your Ban-Limit**
            \`${ban_limit}\``, true)
			.addField('\u200b', stripIndents`\`${togglegreeting}\``, true);

		return message.channel.send(embed2).then(m => m.delete({ timeout: 120000 }));

	}
};