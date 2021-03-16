// importing functions
const { post_API_call } = require('../../../functions/functions');
/**
* @param {Discord.Client} client - The created client instance
* @description This handels all channel creations
*/
module.exports = client => {
    client.on('channelCreate', channel => {
        if (channel.type === 'dm') {
            return;
        }

        const payload = JSON.stringify({
            'channel': channel,
            'guild': channel.guild
        })

        return post_API_call('channel/create', payload, channel.guild, 'channel');
    })
}