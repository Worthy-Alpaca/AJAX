const Discord = require('discord.js');
const { get_API_call } = require('../../functions/functions.js');
const { stripIndents } = require('common-tags');
var { prefix } = require('../../src/config.json');

module.exports = {
	name: 'ranks',
	category: 'info',
	permission: ['none', 'moderator', 'admin'],
	description: 'Shows available ranks',

	run: async (client, message, args, api) => {

		const ranks = await get_API_call(message, 'misc/get', 'misc/rank');

		if (api.prefix !== null) {
			prefix = api.prefix; //##########################
		}

		const embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setFooter(`Use the ${prefix}rank command to join a rank`)
			.setThumbnail(message.guild.iconURL())
			.setTimestamp()
			.setTitle('Available ranks')
			.setDescription('Don\'t see a game you play? Let us know!')
			.addField('\u200b', stripIndents`- ${ranks.join('\n- ')}`, true);

		return message.channel.send(embed);

	}

};