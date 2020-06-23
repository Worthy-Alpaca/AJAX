const Discord  = require("discord.js");
const { stripIndents } = require("common-tags");
const { prefix, version } = require("../../src/config.json");
const {getAdmin, getMod} = require("../../functions/functions.js");
const cat = require("../fun/cat");

module.exports = {
    name: "help",
    aliases: ["info"],
    category: "info",
    permission: ["none", "moderator", "admin"],
    description: "Returns all commands, or one specific command info",
    usage: "[command | alias]",
    run: async (client, message, args, con) => {
        if (message.deletable) message.delete();
        //console.log(client.commands)
        const adm = await getAdmin(message, con);
        const mod = await getMod(message, con);
        var perms;
        
        if (message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id=== adm).id)) {
            perms = "admin"
        } else if (message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id=== mod).id)) {
            perms = "moderator"
        } else {
            perms = "none"
        }
        
        if (args[0]) {
            return getCMD(client, message, args[0]);
        } else {
            return getAll(client, message, perms);
        }

    }


}


function getAll(client, message, perms) {
    

        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setFooter(`Version: ${version}`)
            .setTimestamp()
            .setTitle("Help menu")
            .setThumbnail(client.user.displayAvatarURL())
            

        const commands = (category, perms) => {
            return client.commands
                .filter(cmd => cmd.category === category && cmd.permission.includes(perms))
                .map(cmd => `- \`${prefix}${cmd.name}\`=> \`${cmd.description}\``)
                .join("\n");

        }
        
        const info = client.categories                      
            .map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(cat, perms)}`)
            .reduce((string, category) => string + "\n" + category);
        
        
        if (perms === "none" || perms === "moderator") {
            return message.channel.send(embed.setDescription(`${info}
            - \`No commands in this category\``)).then(m => m.delete( {timeout: 120000} ));
        } else {
            return message.channel.send(embed.setDescription(info)).then(m => m.delete( {timeout: 120000} ));
        }
    
    
}

function getCMD(client, message, input) {
    const embed = new Discord.MessageEmbed()

    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));

    let info = `What do you mean with **${input.toLowerCase()}**? I don't know what you are talking about`;

    if (!cmd) {
        return message.channel.send(embed.setColor("RED").setDescription(info));

    }

    if (cmd.name) info = `**Command name**: ${cmd.name}`;
    if (cmd.aliases) info = `\n**Aliases**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
    if (cmd.descriptionlong) {
        info = `\n**Description**: ${cmd.descriptionlong}`
    } else {
        info = `\n**Description**: ${cmd.description}`
    };
    if (cmd.usage) {
        info += `\n**Usage**: ${cmd.usage}`;
        embed.setFooter(`Syntax: <> = required, [] = optional`);

    }

    return message.channel.send(embed.setColor("GREEN").setDescription(info));
}

/* if (message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id=== moderator).id)) {
    const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setFooter(`Version: ${version}`)
        .setTimestamp()
        .setTitle("Help menu")
        .setThumbnail(client.user.displayAvatarURL())

    const commands = (permissions) => {
        return client.commands
            .filter(cmd => cmd.permissions === permissions)
            .map(cmd => `- \`${prefix}${cmd.name}\`=> \`${cmd.description}\``)
            .join("\n");

    }

    const info = client.categories
        .map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(cat)}`)
        .reduce((string, category) => string + "\n" + category);

    return message.channel.send(embed.setDescription(info));    
} */