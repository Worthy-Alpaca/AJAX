const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
const { version } = require("../../src/config.json");
var { prefix } = require("../../src/config.json");
const { getAdmin, getMod, getprefix } = require("../../functions/db_queries.js");
const cat = require("../fun/cat");
const { promptMessage } = require("../../functions/functions.js");

module.exports = {
    name: "help",
    aliases: ["info"],
    category: "info",
    permission: ["none", "moderator", "admin"],
    description: "Returns this list",
    descriptionlong: "Returns a menu of with commands you have access to. You have 4min per site to do stuff :grin:",
    usage: "[command | alias]",
    run: async (client, message, args, con) => {
        if (message.deletable) message.delete();
        //console.log(client.commands)
        const adm = await getAdmin(message, con);
        const mod = await getMod(message, con);
        var perms;
        var i = 0;
        var a = true;
        const custom_prefix = await getprefix(message, con);
        const chooseArr = ["◀", "▶"]

        if (custom_prefix !== null) {
            prefix = custom_prefix;
        }
        var cats = [client.categories[i]];

        if (args[0]) {
            return getCMD(client, message, args[0]);
        } else {
            while (a && i < client.categories.length) {

                if (message.author.id === "595341356432621573") {
                    perms = "author"
                } else if (message.member.hasPermission("ADMINISTRATOR")) {
                    perms = "admin"
                } else if (message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id === mod).id)) {
                    perms = "moderator"
                } else {
                    perms = "none"
                }

                cats = [client.categories[i]];
                await getAll(client, message, perms, cats).then(async msg => {

                    if (i === 0) {
                        var reaction = await promptMessage(msg, message.author, 240000, chooseArr[1]);

                        if (reaction === chooseArr[1]) {
                            msg.delete();
                            i++;
                            return
                        }
                    } else if (i === client.categories.length -1) {
                        var reaction = await promptMessage(msg, message.author, 240000, chooseArr[0]);

                        if (reaction === chooseArr[0]) {
                            msg.delete();
                            i--;
                            return
                        }
                    } else {
                        var reaction = await promptMessage(msg, message.author, 240000, chooseArr);

                        if (reaction === "◀") {
                            msg.delete();
                            i--;
                            return
                        } else if (reaction === "▶") {
                            msg.delete();
                            i++;
                            return
                        }
                    }


                })
            }

        }

    }


}


async function getAll(client, message, perms, cats) {


    const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setFooter(`Version: ${version}`)
        .setTimestamp()
        .setTitle("Help menu")
        .setThumbnail(client.user.displayAvatarURL())


    const commands = (category, perms) => {
        if (perms === "author") {
            return client.commands
                .filter(cmd => cmd.category === category)
                .map(cmd => `- \`${prefix}${cmd.name}\` => \`${cmd.description}\``)
                .join("\n");
        } else {
            return client.commands
                .filter(cmd => cmd.category === category && cmd.permission.includes(perms))
                .map(cmd => `- \`${prefix}${cmd.name}\` => \`${cmd.description}\``)
                .join("\n");
        }
    }

    const info = cats
        .map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(cat, perms)}`)
        .reduce((string, category) => string + "\n" + category);


    if ((perms === "none" || perms === "moderator") && cats[0] === "setup") {
        return message.channel.send(embed.setDescription(`${info}
            - \`You don't have permission for this category\``))
    } else {
        return message.channel.send(embed.setDescription(info))
    }



}

function getCMD(client, message, input) {
    const embed = new Discord.MessageEmbed()
        .setTimestamp()
        .setThumbnail(client.user.displayAvatarURL())

    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));

    let info = `What do you mean with **${input.toLowerCase()}**? I don't know what you are talking about`;

    if (!cmd) {
        return message.channel.send(embed.setColor("RED").setDescription(info));

    }

    if (cmd.name) embed.setTitle(`**${cmd.name.toUpperCase()}**`);
    if (cmd.aliases) embed.addField(`\u200b`, stripIndents`**Aliases**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`);
    if (cmd.descriptionlong) {
        info = `\n**Description**: ${cmd.descriptionlong}`
    } else {
        info = `\n**Description**: ${cmd.description}`
    };
    if (cmd.usage) {
        info += `\n**Usage**: ${cmd.usage}`;
        embed.setFooter(`Syntax: <> = required, [] = optional`);

    }

    return message.channel.send(embed.setColor("GREEN").setDescription(info)).then(m => m.delete({ timeout: 120000 }));
}