const { getAdmin, getMod } = require("../../functions");

module.exports = {
    name: "close",
    category: "moderation",
    description: "Clears a voice channel",
    usage: "<channel>",
    run: async (client, message, args, con) => {
        message.delete();

        var admin = await getAdmin(message, con);
        var moderator = await getMod(message, con);

        if (admin === null) {
            return message.channel.send("You need to set the role for admin first. Do that by typing !setadmin")
        }
        if (moderator === null) {
            return message.channel.send("You need to set the role for moderator first. Do that by typing !setmod")
        }

        if (!message.member.roles.has(message.guild.roles.find(r => r.id=== admin).id)) {
            if (!message.member.roles.has(message.guild.roles.find(r => r.id=== moderator).id)) {
                return message.reply("You are not powerfull enough to do that.")
                    .then(m => m.delete(5000));
            } 
        }
        

        if (!args[0]) {
            return message.reply("You need to tell me what channel to close down")
        }    

        const mRole = args.slice(0);
        
        const channel = message.guild.channels.find(channel => channel.name === mRole.join(" "));

        if (!channel) {
            return message.reply("That channel does not exist")
        }

        if (channel.type !== 'voice') {
            return message.reply("That is not a voice channel")
        }

        //console.log(channel)
        

        for (const [memberID, member] of channel.members) {
            member.setVoiceChannel(null)
              .catch(console.error);
        }


    }
}