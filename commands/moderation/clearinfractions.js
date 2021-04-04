const { get_API_call, delete_API_call } = require('../../functions/functions.js');


module.exports = {
	name: 'clear-infractions',
	category: 'moderation',
	permission: ['admin'],
	description: 'Clears the infraction count for the given member',
	usage: '[mention]',
	run: async (client, message, args, api) => {

		let rMember = message.mentions.members.first() || message.author;

		const tblid = Array.from(message.guild.name);
		tblid.forEach(function (item, i) { if (item == ' ') tblid[i] = '_'; });

		const infractions = await get_API_call(message, 'misc/get', 'misc/infractions', tblid.join(''), rMember.id);

		if (!rMember) {
			return message.reply('This member does not exist on this server');
		}

		if (infractions === 0) {
			return message.reply('No infractions to clear');
		} else {
			const payload = JSON.stringify({
				server: tblid.join(''),
				value: rMember.id
			});
			const success = await delete_API_call('misc/delete', payload, message.guild, 'misc/infractions');

			if (success.success === true) {
				return message.reply(`Infractions for ${rMember} have been cleared`);
			} else if (success.success === false && success.status === 200) {
				return message.reply(`No Infractions for ${rMember} found!`);
			} else {
				return message.reply(`An error occured: ${success.err}`);
			}
		}


	}

};