const { setprefix } = require('../../functions/setupfunctions');

module.exports = {
	name: 'setprefix',
	category: 'setup',
	permission: ['admin'],
	description: 'Set the prefix',
	run: async (client, message, args) => {
        
		if (!message.member.hasPermission('ADMINISTRATOR')){
			return message.reply('You are not powerful enough to do that');
		}

		return setprefix(message);

	}
};