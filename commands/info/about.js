const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { version } = require("../../src/config.json");
const { getapproved2 } = require("../../functions/functions.js");


module.exports = {
    name: "about",
    category: "info",
    description: "Gives information about the bot and the server",   
    run: async (client, message, args, con) => {

        if (message.deletable) message.delete();

        const guild = message.channel.guild;
        var count = [];

        approvedR = await getapproved2(message, con);
        
        guild.members.forEach(member => {
            if (member.roles.has(message.guild.roles.find(r => r.id === approvedR).id)){
                if (member.id === client.user.id) {
                    return
                } else {
                    name = member.displayName
                    return count.push(name)
                }
            } 
        })

        const embed = new RichEmbed()
            .setColor("RANDOM")
            .setTimestamp()
            .setThumbnail(client.user.displayAvatarURL)
            .setTitle(client.user.username)
            .setURL("https://github.com/Worthy-Alpaca/AJAX")            
            .addField(`\u200b`, stripIndents`**Bot Information**            
            > Version: \`${version}\``)
            .addField(`\u200b`, stripIndents`**Server Information**
            > Server name: ${message.guild.name}
            > Current Member amount: \`${message.guild.memberCount}\`
            > Approved Member amount: \`${count.length}\``);
            

        
       


        return message.channel.send(embed);
    }
    
}