const { filter_integer } = require('../../functions/functions');
const Discord = require('discord.js');

module.exports = {
	name: 'poll',
	category: 'moderation',
	permission: ['moderator', 'admin'],
	description: 'Creates an advanced poll for users to vote in',
	descriptionlong: 'Creates a poll for users to vote in. Can be used with up to 6 answers. Doesn\'t protect against multi-entries!',
	usage: '<channel>, <Number of answers>, <Question>',
	run: async (client, message, args, api) => {
		if (!args.length) return message.reply(`Please refer to \`${api.prefix}help ${module.exports.name}\` before using this command!`);
		const poll = client.polls.get(message.guild.id);
		if (poll) return message.reply(`You already have a poll going. You need to close it with \`${api.prefix}close-poll\` before creating a new one!`);
		const channel = message.mentions.channels.first();
		if (!channel) return message.reply('Please tag a channel for the poll to be posted to!');
		if (await filter_integer(message, args[0]) !== channel.id) return message.reply('Please put the channel first!');
		const numA = args[1];
		if (!Number.isInteger(+numA) || numA < 1 || numA > 6) return message.reply('Please specify the number of answers you want (1-4)!');
		let validReactions;
		switch (parseInt(numA, 10)) {
		case 1:
			validReactions = ['1️⃣'];
			break;
		case 2:
			validReactions = ['1️⃣', '2️⃣'];
			break;
		case 3:
			validReactions = ['1️⃣', '2️⃣', '3️⃣'];
			break;
		case 4:
			validReactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];
			break;
		case 5:
			validReactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
			break;
		case 6:
			validReactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'];
			break;
		}
		const description = args.slice(2).join(' ');
		const embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTimestamp()
			.setTitle('Poll')
			.setAuthor(message.member.displayName, message.member.user.displayAvatarURL())
			.setFooter('React below to cast your vote')
			.setDescription(description);

		channel.send(embed).then(async message => {
			for (const reaction of validReactions) await message.react(reaction);
			const params = {
				pollMessage: message,
				description: description,
				reactions: validReactions,
				simple: false,
				counts: {}
			};
			client.polls.set(message.guild.id, params);
		});


	}
};