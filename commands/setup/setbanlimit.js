const { setbanlimit } = require('../../functions/setupfunctions');

module.exports = {
	name: 'setbanlimit',
	category: 'setup',
	permission: ['admin'],
	description: 'Set the admin role',
	run: async (client, message, args) => {

		if (!message.member.hasPermission('ADMINISTRATOR')) {
			return message.reply('You are not powerful enough to do that');
		}

		return setbanlimit(message);

	}
};