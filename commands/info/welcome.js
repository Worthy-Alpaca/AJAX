const { RichEmbed } = require("discord.js");
const { getMember, formatDate } = require("../../functions.js");
const { stripIndents } = require("common-tags");


module.exports = {
    name: "welcome",
    category: "info",
    description: "Give the welcome message",
    usage: "[mention]",

    run: async (client, message, args) => {
        
        const member = getMember(message, args.join(" "));

        const embed = new RichEmbed()
            .setColor("RANDOM")
            .setTimestamp()
            .setAuthor("New member", member.user.displayAvatarURL)
            .setDescription(stripIndents`Welcome to the idiotsatlarge discord server ${member}.
        We are a clan of friendly people who have fun and work together.
        You have any questions or need help? Just ask ingame or on this server. :grin:
        To keep the clan going, player inactivity fo 30 days will result in discharge.
        If you are away for more than 30 days, just message @jonhhammer or leave a message here on the server.`);

        //const emoji = ["??"]

        //const m = await message.channel.send(embed);
        //const reacted = await promptMessage(m, member.user, 90, emoji);


        //if (reacted === emoji) {
        //member.addRole("test-role").catch(e => console.log(e.message))
        //}
       


        return message.channel.send(embed);
    }
    
}