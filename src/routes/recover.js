const router = require('express').Router();
// import client
const client = require('../client');
const Discord = require('discord.js');
const { version } = require('../config.json');
const functions = require('../../functions/functions');


router.get('/', async (req, res) => {
	const guild = client.guilds.cache.get(req.query.guildID);
	if (!guild) return;
	res.status(200).end();
	recover(guild.owner, guild);
});

function recover(owner, guild) {
	return new Promise(function (resolve, reject) {
		const embed = new Discord.MessageEmbed()
			.setTimestamp()
			.setColor('YELLOW')
			.setFooter(`Version: ${version}`)
			.setThumbnail(client.user.displayAvatarURL())
			.setTitle('Password reset')
			.setDescription(`Your requested a password reset for the guild: \`${guild.name}\`. Please respond with your new password. If you believe this to be an error please type \`abort\` to stop the recovery process.`);

		owner.send(embed).then((message) => {
            
			const filter = m => owner.id === m.author.id;


			message.channel.awaitMessages(filter, { time: 120000, max: 1, errors: ['time'] })
				.then(async messages => {
                    
					let password = messages.first().content;

					if (password.toLowerCase() === 'abort') {
						message.channel.send('Password reset aborted!');
						return resolve(false);
					}

					msg = message.channel.send(`Your new password is \`${password}\``);

					const payload = JSON.stringify({
						guild: guild,
						value: password
					});

					const success = await functions.update_API_call('recover', payload, guild, 'recover');
					if (success.success === true) {
						return resolve(true);
					} else {
						message.channel.send(`An Error occured: ${success.err}`);
						return resolve(true);
					}
				})
				.catch(() => {
					message.channel.send('Something went wrong!');
					return resolve(false);
				});

		});
	});
}

module.exports = router;