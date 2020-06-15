const Discord  = require("discord.js");
const { stripIndents } = require("common-tags");
const { version } = require("../../src/config.json");
const { getapproved2 } = require("../../functions/functions.js");
const { homepage } = require("../../package.json");


module.exports = {
    name: "about",
    category: "info",
    description: "Gives information about the bot and the server",   
    run: async (client, message, args, con) => {

        if (message.deletable) message.delete();

        const guild = message.channel.guild;
        var count = [];

        approvedR = await getapproved2(message, con);
        role = message.guild.roles.cache.find(r => r.id === approvedR);

        if (!role) {
            return message.reply("No role for approved members found. You can change that with !setapproved")
        }
        
        guild.members.cache.forEach(member => {
            if (member.user.bot) return;
            if (member.roles.cache.has(role.id)){
                if (member.id === client.user.id) {
                    return
                } else {
                    name = member.displayName
                    return count.push(name)
                }
            } 
        })

        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTimestamp()
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle(client.user.username)
            .setURL(homepage)            
            .addField(`\u200b`, stripIndents`**Bot Information**            
            > Version: \`${version}\``)
            .addField(`\u200b`, stripIndents`**Server Information**
            > Server name: ${message.guild.name}
            > Current Member amount: \`${message.guild.memberCount}\`
            > Approved Member amount: \`${count.length}\``);
            

        
       


        return message.channel.send(embed);
    }
    
}