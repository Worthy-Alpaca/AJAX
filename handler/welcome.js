const { RichEmbed } = require("discord.js");

module.exports = {
    
    run: async (member) => {
        const channel = member.guild.channels.find(channel => channel.name === "welcome");
        if (!channel) return;


        const embed = new RichEmbed()
            .setColor("RANDOM")
            .setTimestamp()
            .setAuthor("New member", member.user.displayAvatarURL)
            .setDescription(stripIndents`Welcome to the idiotsatlarge discord server ${member}.
        We are a clan of friendly people who have fun and work together.
        You have any questions or need help? Just ask ingame or on this server. :grin:
        To keep the clan going, player inactivity fo 30 days will result in discharge.
        If you are away for more than 30 days, just message @jonhhammer or leave a message here on the server.`);


        const m = await message.channel.send(embed);
        const reacted = await promptMessage(m, message.author, 30, ["?"]);
        

        if (reacted === "?") {
            member.addRole("test-role").catch(e => console.log(e.message))
        }


        return channel.send(embed);
    }
}