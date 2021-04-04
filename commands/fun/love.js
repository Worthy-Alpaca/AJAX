const Discord = require('discord.js');


module.exports = {
	name: 'love',
	aliases: ['affinity'],
	category: 'fun',
	permission: ['none', 'moderator', 'admin'],
	description: 'Calculates the love affinity you have for another person.',
	usage: '[mention | id | username]',
	run: async (client, message, args) => {
		// Get a member from mention, id, or username
		let person = message.mentions.members.first();

		if (!person || message.author.id === person.id) {
			person = message.guild.members.cache
				.filter(m => m.id !== message.author.id)
				.random();
		}

		const love = Math.random() * 100;
		const loveIndex = Math.floor(love / 10);
		const loveLevel = '💖'.repeat(loveIndex) + '💔'.repeat(10 - loveIndex);

		const embed = new Discord.MessageEmbed()
			.setColor('#ffb6c1')
			.addField(`☁ **${person.displayName}** loves **${message.member.displayName}** this much:`,
				`💟 ${Math.floor(love)}%\n\n${loveLevel}`);

		message.channel.send(embed);
	}
};