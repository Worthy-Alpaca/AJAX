const { Client, RichEmbed, Collection } = require("discord.js");
const { token, prefix } = require('./config.json');
const fs = require("fs");
const { stripIndents } = require("common-tags");

const client = new Client({
    disableEveryone: true
});

client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");









["command"].forEach(handler => {
    require(`./handler/${handler}`)(client);

});

client.on("ready", () => {

    console.log(`I'm now online, my name is ${client.user.username}`);

    client.user.setPresence({
        status: "online",
        game: {
            name: "the idiots play",
            type: "WATCHING"
        }
    });
});

client.on("guildMemberAdd", member => {
    const channel = member.guild.channels.find(channel => channel.name === "general-chat");
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

    return channel.send(embed);
});

client.on("message", async message => {
    

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command)
        command.run(client, message, args);
    
})

client.login(token);


