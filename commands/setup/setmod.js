const { setmd } = require('../../functions/setupfunctions');

module.exports = {
	name: 'setmod',
	category: 'setup',
	permission: ['admin'],
	description: 'Set the moderator role',
	run: async (client, message, args) => {
        
		if (!message.member.hasPermission('ADMINISTRATOR')){
			return message.reply('You are not powerful enough to do that');
		}

		return setmd(message);

	}
};