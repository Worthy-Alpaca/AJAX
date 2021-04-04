// importing functions 
const { get_API_call } = require('../../functions/functions');
// importing additional module
const Discord = require('discord.js');
/**
* @param {Discord.Client} client - The created client instance
* @description This will be executed when a new member joins the guild
*/
module.exports = client => {
	client.on('guildMemberAdd', async member => {

		if (member.user.bot) return;
		const api = await get_API_call(member, 'getserver');
		if (api.togglegreeting === 'true') {
			return;
		}
		var greeting = api.greeting;
		const role = member.guild.roles.cache.find(r => r.id === api.approved);
		var msg = api.server_greeting;
		var channel = member.guild.channels.cache.find(channel => channel.id === api.channel); 

		if (typeof greeting == 'undefined' || greeting === null) {
			greeting = 'Welcome to this generic server. The owner has not bothered with a custom welcome message so you get this one. :person_shrugging:';
		}

		if (typeof channel == 'undefined' || channel === null) {
			channel = member.guild.channels.cache.find(channel => channel.id === member.guild.systemChannelID);
		}

		if (api.auto_approved === 'true') {
			member.roles.add(role.id).catch(e => console.log(e.message));
			if (msg === null) {
				msg = 'welcome to this generic server :grin:';
			}

			const embed = new Discord.MessageEmbed()
				.setColor('RANDOM')
				.setTimestamp()
				.setAuthor(`${member.displayName}, ${msg}`, member.user.displayAvatarURL());

			client.users.fetch(member.id, false).then(user => {
				user.send(`Welcome to **${member.guild.name}**. ${greeting}`);
			});

			return channel.send(embed);
		}

		client.users.fetch(member.id, false).then(user => {
			return user.send(`Welcome to **${member.guild.name}**. ${greeting}`);
		});



	});
};