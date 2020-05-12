module.exports = {
    name: "close",
    category: "moderation",
    description: "Clears a voice channel",
    usage: "<channel>",
    run: async (client, message, args) => {
        message.delete();
        
        if (!message.member.hasPermission("KICK_MEMBERS")) {
            return message.reply("You are not powerfull enough to do that.")
                .then(m => m.delete(5000));
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