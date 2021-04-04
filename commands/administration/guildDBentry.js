const { get_API_call, password_generator, post_API_call } = require('../../functions/functions');
const { gather_server_channels, gather_server_roles } = require('../../functions/default_functions');
const { version } = require('../../src/config.json');
const { stripIndents } = require('common-tags');
const { bugs } = require('../../package.json');
var { prefix } = require('../../src/config.json');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const Discord = require('discord.js');

module.exports = {
	name: 'createguild',
	category: 'administration',
	permission: ['null'],
	description: 'Creates a DB entry for a guild',
	run: async (client, message, args) => {
		let guild = message.guild;
		let password = password_generator(8);
		let username = guild.id;
		const token = jwt.sign({ _id: username }, process.env.TOKEN_SECRET);

		await fetch(process.env.API_ADDRESS + '/user/register', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'content-type': 'application/json',
				'auth-token': token
			},
			body: JSON.stringify({
				username: username,
				password: password,
				guild: {
					name: guild.name,
					id: guild.id
				}
			})
		}).then(res => {
			//console.log(res)
			if (res.status === 200) {
				console.log('successfully registered');
			}
		});

		gather_server_channels(guild, post_API_call);
		gather_server_roles(guild, post_API_call);

		const api = await get_API_call(message, 'getserver');

		const custom_prefix = api.prefix;

		if (custom_prefix !== undefined && custom_prefix !== null) {
			prefix = custom_prefix;
		}

		const embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTimestamp()
			.setFooter(`Version: ${version}`)
			.setThumbnail(client.user.displayAvatarURL())
			.setDescription(stripIndents`**Hello there I'm ${client.user.username}**`)
			.addField('\u200b', stripIndents`Thank you for inviting me to your server.
            You should run **${prefix}setserver** to start the customization process. That will set everything up.
            See [${prefix}help](https://ajax-discord.com/commands) for all of my commands. Enjoy :grin:
            You can also log into the [dashboard](https://ajax-discord.com/login).
            Username: \`${username}\`
            Password: \`${password}\``)
			.addField('\u200b', stripIndents`If you have any issues please report them [here.](${bugs.url})`);

		client.users.fetch(guild.owner.id, false).then(user => {
			user.send(embed);
			user.send(`We are currently reviewing an issue with the starting prefix. To make sure you are using the correct one do '@${client.user.username} help' `);
		});
	}
};