const Discord = require("discord.js");
const superagent = require("superagent");
const querystring = require('querystring');
const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
const { RichEmbed } = require("discord.js");


module.exports = {
    name: "elite",
    category: "fun",
    description: "Don't use me. I'm not done.",
    usage: "don't use me yet!",
    run: async (client, message, args) => {
        if (message.deletabe) message.delete();
        return message.reply("This is not working yet. Come back at a later time, maybe I'll have it figured out then :grin:")

        if (!args.length) {
            return message.channel.send('You need to supply a search term!')
                .then(m => m.delete(5000));
        }
        
        const query = querystring.stringify({ term: args.join(' ') });

        let {list} = await superagent
        .get(`https://www.edsm.net/api-v1/system`, {
            method: `GET`,
            headers: {
                systemName: `${args[0]}`,
                showID: 0,
                showCoordinates: 0,
                showPermit: 1,
                showInformation: 1,
                showPrimaryStar: 1,
                includeHidden: 0
            }
        })
        .then(res => console.log(res))
        .then(json => {
            console.log('res', json);
        }).catch(err => {
            console.error(err);
            return ReE(res, err.message, 500);
        });
        

        if (!list.length) {
            return message.channel.send(`No results found for **${args.join(' ')}**.`)
                .then(m => m.delete(5000));
        }

        const [answer] = list;

        const embed = new RichEmbed()
            .setColor('RANDOM')
            .setTitle(answer.word)
            .setURL(answer.permalink)
            .addField('Definition', trim(answer.name, 1024) );
            

        message.channel.send(embed);

        
    }
   }