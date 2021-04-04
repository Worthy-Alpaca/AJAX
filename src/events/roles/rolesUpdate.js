// importing functions
const { update_API_call } = require('../../../functions/functions');
/**
* @param {Discord.Client} client - The created client instance
* @description This handels all role updates
*/
module.exports = client => {
	client.on('roleUpdate', function (oldRole, newRole) {

		const payload = JSON.stringify({
			'role': newRole,
			'guild': newRole.guild
		});

		return update_API_call('role/update', payload, newRole.guild, 'role');
	});
};