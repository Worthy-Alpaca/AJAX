// importing config variables
const { owner, status } = require('../config.json');
/**
* @param {Discord.Client} client - The created client instance
* @description This handels handles the first interaction when the bot is ready
*/
module.exports = client => {
	client.on('ready', async () => {
		console.log(`Logged in as ${client.user.username}`);

		client.users.fetch(owner, false).then(user => {
			user.send('I restarted');
		});

		client.user.setPresence({
			status: 'online',
			activity: {
				name: `${status}`,
				type: 'LISTENING'
			}
		});
	});
};