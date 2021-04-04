const querystring = require('querystring');
const fetch = require('node-fetch');
const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
const Discord  = require('discord.js');


module.exports = {
	name: 'urban',
	category: 'fun',
	permission: ['none', 'moderator', 'admin'],
	description: 'Sends an urban dictonary entry',
	usage: '<word>',
	run: async (client, message, args) => {
		if (message.channel.nsfw === false) {
			return message.channel.send('You can only use this command inside a NSFW channel!');
		}

		if (!args.length) {
			return message.channel.send('You need to supply a search term!');
		}
        
		const query = querystring.stringify({ term: args.join(' ') });
        
		const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());
        

		if (!list.length) {
			return message.channel.send(`No results found for **${args.join(' ')}**.`);
		}

		const [answer] = list;

		const embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle(answer.word)
			.setURL(answer.permalink)
			.addField('Definition', trim(answer.definition, 1024) )
			.addField('Example', trim(answer.example, 1024) )
			.addField('Rating', `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.`);

		return message.channel.send(embed);

	}
};