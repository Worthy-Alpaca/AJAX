const { get_API_call, checkStatus } = require('../../functions/functions');
module.exports = {
	name: 'checkstatus',
	category: 'info',
	permission: ['none', 'moderator', 'admin'],
	description: 'Check if the Bot is operational',
	run: async (client, message, args) => {

		return checkStatus(message, get_API_call);

	}
};