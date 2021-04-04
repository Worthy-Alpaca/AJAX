const Discord = require('discord.js');
const { stripIndents } = require('common-tags');
const { version } = require('../../src/config.json');
const { homepage, bugs } = require('../../package.json');


module.exports = {
	name: 'about',
	category: 'info',
	permission: ['none', 'moderator', 'admin'],
	description: 'Gives information about the bot and the server',
	run: async (client, message, args, api) => {

		const guild = message.channel.guild;
		var count = [];
		var bots = [];
        
		//approvedR = await getapproved2(message);
		role = message.guild.roles.cache.find(r => r.id === api.approved); //###########################

		if (!role) {
			return message.reply('No role for approved members found. You can change that with !setapproved');
		}

		guild.members.cache.forEach(member => {
			if (member.user.bot) return bots.push(member.displayName);
			if (member.roles.cache.has(role.id)) {
				if (member.id === client.user.id) {
					return;
				} else {
					let name = member.displayName;
					return count.push(name);
				}
			}
		});

		const embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTimestamp()
			.setThumbnail(client.user.displayAvatarURL())
			.setTitle(client.user.username)
			.setURL(homepage)
			.addField('\u200b', stripIndents`**Bot Information**            
            > Version: \`${version}\``)
			.addField('\u200b', stripIndents`**Server Information**
            > Server name: ${message.guild.name}
            > Current Member amount: \`${message.guild.memberCount - bots.length}\`
            > Approved Member amount: \`${count.length}\`
            > Bots: \`${bots.length}\``)
			.addField('\u200b', stripIndents`You have a server where you want to deploy this bot?
            You can do so [here.](https://discord.com/api/oauth2/authorize?client_id=682255208125956128&permissions=301182039&redirect_uri=https%3A%2F%2Fajax-discord.com&scope=bot)`)
			.addField('\u200b', stripIndents`If you have any issues please report them [here.](${bugs.url})`);

		return message.channel.send(embed);
	}

};