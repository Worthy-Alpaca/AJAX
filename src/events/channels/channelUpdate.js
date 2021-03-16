// importing functions
const { update_API_call } = require('../../../functions/functions');
/**
* @param {Discord.Client} client - The created client instance
* @description This handels all channel updates
*/
module.exports = client => {
    client.on('channelUpdate', function (oldChannel, newChannel) {

        const payload = JSON.stringify({
            'channel': newChannel,
            'guild': newChannel.guild
        })

        return update_API_call('channel/update', payload, newChannel.guild, 'channel');
    })
}