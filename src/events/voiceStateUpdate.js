/**
* @param {Discord.Client} client - The created client instance
* @description This handels changes in voiceStates
*/
module.exports = client => {
	client.on('voiceStateUpdate', (oldState, newState) => {

		if (oldState.channelID === null || typeof oldState.channelID == 'undefined') return;
		if (newState.id !== client.user.id) return;

		const queue = client.queue;
		queue.delete(oldState.guild.id);

	});
};