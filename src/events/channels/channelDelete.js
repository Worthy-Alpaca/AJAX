// importing functions
const { delete_API_call } = require('../../../functions/functions');
/**
* @param {Discord.Client} client - The created client instance
* @description This handels all channel deletions
*/
module.exports = client => {
	client.on('channelDelete', channel => {

		const payload = JSON.stringify({
			'channel': channel,
			'guild': channel.guild
		});

		return delete_API_call('channel/delete', payload, channel.guild, 'channel');
	});
};