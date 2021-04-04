const client = require('../src/client');
const { owner } = require('../src/config.json');
const Discord = require('discord.js');
const jwt = require('jsonwebtoken');

module.exports = {
	/**
    * @description handles errors
    * @param {object} error - the error object
    */
	error_handler: function (error) {

		const embed = new Discord.MessageEmbed()
			.setTimestamp()
			.setTitle('An Error Occured')
			.setDescription(error.code)
			.addField('\u200b', `**Type:** ${error.type}
            **Message:** ${error.message}`);

		client.users.fetch(owner, false).then(user => {
			return user.send(embed);
		});
	},
	/**
    * @description creates a signed token
    * @param {sting} ID - the guild ID
    * @returns {JsonWebKey} token - the token used to authenticate with the API
    */
	sign_token: function (id) {
		return jwt.sign({ _id: id }, process.env.TOKEN_SECRET, { expiresIn: '1m'});
	},
	/**
    * @description gathers all channels from all guilds
    * @param {Discord.Client} client - the client instance
    * @param {function} post_API_call - the function to create a POST API request
    */
	gather_channels: function (client, post_API_call) {
		client.guilds.cache.forEach(server => {
			server.channels.cache.forEach(channel => {

				if (channel.type === 'dm') {
					return;
				}

				const payload = JSON.stringify({
					'channel': channel,
					'guild': channel.guild
				});

				return post_API_call('channel/create', payload, channel.guild, 'channel');
			});
		});
	},
	/**
    * @description gathers all roles from all guilds
    * @param {Discord.Client} client - the client instance
    * @param {function} post_API_call - the function to create a POST API request
    */
	gather_roles: function (client, post_API_call) {
		client.guilds.cache.forEach(server => {
			server.roles.cache.forEach(role => {
				const payload = JSON.stringify({
					'role': role,
					'guild': role.guild
				});

				return post_API_call('role/create', payload, role.guild, 'role');
			});
		});
	},
	/**
    * @description gathers all channels from a guild
    * @param {Discord.Client} server - the current guild
    * @param {function} post_API_call - the function to create a POST API request
    */
	gather_server_channels: function (server, post_API_call) {
		server.channels.cache.forEach(channel => {

			if (channel.type === 'dm') {
				return;
			}

			const payload = JSON.stringify({
				'channel': channel,
				'guild': channel.guild
			});

			return post_API_call('channel/create', payload, channel.guild, 'channel');
		});
	},
	/**
    * @description gathers all roles from a guild
    * @param {Discord.Client} server - the current guild
    * @param {function} post_API_call - the function to create a POST API request
    */
	gather_server_roles: function (server, post_API_call) {
		server.roles.cache.forEach(role => {
			const payload = JSON.stringify({
				'role': role,
				'guild': role.guild
			});

			return post_API_call('role/create', payload, role.guild, 'role');
		});
	},
};