const { RichEmbed } = require("discord.js");
const { getMember, formatDate } = require("../../functions.js");
const { stripIndents } = require("common-tags");


module.exports = {
    name: "welcome",
    category: "info",
    description: "Give the welcome message",
    usage: "<mention>",

    run: async (client, message, args) => {

        //if (message.deletable) message.delete();
        
        //const member = getMember(message, args.join(" "));
        const rMember = getMember(message, args.join(" ")); //message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!rMember) return message.reply("You need to welcome someone.")

        const embed = new RichEmbed()
            .setColor("RANDOM")
            .setTimestamp()
            .setAuthor(`We have a new member`, rMember.user.displayAvatarURL)
            .setDescription(stripIndents`Hello ${rMember} and welcome to the idiotsatlarge discord server. :partying_face:
        We are a clan of friendly people who have fun and work together.
        You have any questions or need help? Just ask ingame or on this server. :grin:
        To keep the clan going, player inactivity fo 30 days will result in discharge.
        If you are away for more than 30 days, just message @jonhhammer or leave a message here on the server.
        If you want to join the raid, use !raid to get the corresponding role.
        Please do not join someone ingame without asking first.`);

        
       


        return message.channel.send(embed);
    }
    
}