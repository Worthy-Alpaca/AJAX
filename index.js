const { Client, RichEmbed, Collection } = require("discord.js");
const { token, prefix, version, status, welcome_channel, } = require('./config.json');
const fs = require("fs");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("./functions.js");


const client = new Client({
    disableEveryone: false
});

client.reply = new Collection();
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");





["command"].forEach(handler => {
    require(`./handler/${handler}`)(client);

});

client.on("ready", () => {

    console.log(`I'm now online, my name is ${client.user.username}`);
    //console.log(client.channels);

    client.fetchUser("595341356432621573", false).then(user => {
        user.send(`I'm online`)
    });

    client.user.setPresence({
        status: "online",
        game: {
            name: `${status}`,
            type: "WATCHING"
        }
    });
});



client.on("guildMemberAdd", async member => {
    if (member.bot) return;
    const channel = member.guild.channels.find(channel => channel.name === `${welcome_channel}`);
    if (!channel) return;


    const embed = new RichEmbed()
        .setColor("RANDOM")
        .setTimestamp()
        .setAuthor(`We have a new member`, member.user.displayAvatarURL)
        .setDescription(stripIndents`Hello ${member} and welcome to the idiotsatlarge discord server. :partying_face:
        We are a clan of friendly people who have fun and work together.
        You have any questions or need help? Just ask ingame or on this server. :grin:
        To keep the clan going, player inactivity fo 30 days will result in discharge.
        If you are away for more than 30 days, just message @jonhhammer or leave a message here on the server.
        If you want to join the raid, use !raid to get the corresponding role.
        Please do not join someone ingame without asking first.`);

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


