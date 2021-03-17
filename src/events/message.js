// importing functions 
const { get_API_call, checkStatus } = require('../../functions/functions');
// importing config values
const { DIFF, LIMIT, TIME, owner, version } = require('../config.json');
var { prefix } = require('../config.json');
// importing additional modules
const { stripIndents } = require("common-tags");
const Discord = require('discord.js');
const fs = require('fs');
// creating new Map
const usersMap = new Map();
/**
* @param {Discord.Client} client - The created client instance
* @description This handels all message interactions with the bot
*/
module.exports = client => {
    client.on("message", async message => {
        if (message.author.bot) return;

        if (message.guild === null) {
            fs.appendFile('logs/PMs.txt', `${message.content} \n`, function (err) {
                if (err) console.log(err);
            });
            return;
        }

        const api = await get_API_call(message, "getserver");

        if (api === false) {
            client.users.fetch(owner, false).then(user => {
                user.send(`API is not responding`)
            });
        }

        const custom_prefix = api.prefix;

        if (custom_prefix !== undefined && custom_prefix !== null) {
            prefix = custom_prefix;
        }

        //automated spam detection and mute
        if (usersMap.has(message.author.id)) {
            let mutee = message.member;
            const admin = message.guild.roles.cache.find(r => r.id === api.admin);
            const report = message.guild.channels.cache.find(channel => channel.id === api.reports);
            const userData = usersMap.get(message.author.id);
            const { lastMessage, timer } = userData;
            const difference = message.createdTimestamp - lastMessage.createdTimestamp;
            let muterole = message.guild.roles.cache.find(r => r.name === "Muted")

            const embed = new Discord.MessageEmbed()
                .setColor("#ff0000")
                .setTimestamp()
                .setFooter(message.guild.name, message.guild.iconURL)
                .setAuthor("Muted member", mutee.user.displayAvatarURL())
                .setDescription(stripIndents`**> Member: ${mutee} (${mutee.id})
            **> Automated Mute
            **> Muted in: ${message.channel}
            **> Reason: SPAM
            MUTE needs to be manually removed`);

            if (!muterole) {
                try {
                    muterole = await message.guild.roles.create({
                        data: {
                            name: "Muted",
                            color: "#514f48",
                            permissions: []
                        }
                    })
                    message.guild.channels.cache.forEach(async (channel, id) => {
                        await channel.updateOverwrite(muterole, {
                            SEND_MESSAGES: false,
                            SPEAK: false,
                            ADD_REACTIONS: false,
                            SEND_TTS_MESSAGES: false,
                            ATTACH_FILES: false
                        })
                    })
                } catch (e) {
                    console.log(e.stack);
                }
            }
            let msgCount = userData.msgCount;

            if (difference > DIFF) {
                clearTimeout(timer);
                console.log('Cleared timeout');
                userData.msgCount = 1;
                userData.lastMessage = message;
                userData.timer = setTimeout(() => {
                    usersMap.delete(message.author.id);
                    console.log('Removed from RESET.');
                }, TIME);
                usersMap.set(message.author.id, userData);
            }
            else {
                ++msgCount;
                if (parseInt(msgCount) === LIMIT) {
                    if (!mutee.roles.cache.has(admin.id)) {
                        mutee.roles.add(muterole);
                        message.channel.send(`${mutee} You have been muted. Please contact a staff member to get that reversed.`);
                        report.send(`@here, someone has been auto-muted.`);
                        report.send(embed);
                    }
                } else {
                    userData.msgCount = msgCount;
                    usersMap.set(message.author.id, userData);
                }
            }
        }
        else {
            let fn = setTimeout(() => {
                usersMap.delete(message.author.id);
            }, TIME);
            usersMap.set(message.author.id, {
                msgCount: 1,
                lastMessage: message,
                timer: fn
            });
        }

        if (!message.guild) return;

        //listening for the approved command
        if (message.content.startsWith(`${api.startcmd}`)) {
            message.delete();

            const member = message.member;
            var msg = api.server_greeting;

            const role = message.guild.roles.cache.find(r => r.id === api.approved);
            var channel = member.guild.channels.cache.find(channel => channel.id === api.channel);

            if (typeof channel == 'undefined') {
                channel = member.guild.channels.cache.find(channel => channel.id === member.guild.systemChannelID);
            } else if (channel === null) {
                channel = member.guild.channels.cache.find(channel => channel.id === member.guild.systemChannelID);
            }

            if (message.member.roles.cache.has(role.id)) {
                return;
            }

            if (msg === null) {
                msg = "welcome to this generic server :grin:"
            }

            const embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTimestamp()
                .setAuthor(`${member.displayName}, ${msg}`, member.user.displayAvatarURL());

            message.member.roles.add(role.id).catch(e => console.log(e.message));

            return channel.send(embed);
        }

        //listening for commands on mention
        if (message.mentions.has(client.user)) {
            if (message.content.toLowerCase().includes("help") || message.content.toLowerCase().includes("prefix")) {
                return message.reply(`My prefix for this server is \`${prefix}\`. You can use \`${prefix}help\` to get all the commands available to you.`)
            }
            if (message.content.toLowerCase().includes("version")) {
                return message.reply(`Current version is \`${version}\``)
            }
            if (message.content.toLowerCase().includes("check status") || message.content.toLowerCase().includes("status")) {
                return checkStatus(message, get_API_call);
            }

            if (message.content.toLowerCase().includes("newguild")) {
                if (message.author.id !== owner) return;

                let command = client.commands.get('createguild');
                command.run(client, message)
            }
        }

        //command parser
        if (!message.content.startsWith(prefix)) {
            return;
        }

        if (api === false) {
            message.channel.send("API connection temporarily unavailable. Some commands might not work as intended!");
        }

        if (!message.member) message.member = await message.guild.fetchMember(message);

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();

        if (cmd.length === 0) return;

        let command = client.commands.get(cmd);
        if (!command) command = client.commands.get(client.aliases.get(cmd));
        if (!command) return message.reply(`\`${api.prefix + cmd}\` doesn't exist!`);
        if (command.category === 'administration' && message.author.id !== owner) {
            client.users.fetch(owner, false).then(user => {
                user.send(`${message.author} tried to use \`${command.name}\` in \`${message.guild.name}\``);
            })
        }

        //Handling the permission check on a global level
        let perms;
        let admin = message.guild.roles.cache.get(api.admin);
        let moderator = message.guild.roles.cache.get(api.moderator);

        if (admin && moderator) {
            if (message.member.roles.cache.has(admin.id)) {
                perms = "admin";
            } else if (message.member.roles.cache.has(moderator.id)) {
                perms = "moderator";
            } else {
                perms = "none";
            }
        } else {
            message.channel.send(`Commands are currently locked to non-administrative mode. You can change that by using the ${prefix}setserver command.`);
            perms = "none";
        }

        if (command.category === "administration" && message.author.id !== owner) {
            return message.reply(`\`${api.prefix + command.name}\` doesn't exist. Believe me, it really doesn't!`);
        }

        if (command.permission.includes(perms) || message.member.hasPermission('ADMINISTRATOR') || message.author.id === owner) {
            command.run(client, message, args, api);
        } else {
            return message.reply(`You do not have the required permission to access \`${api.prefix + command.name}\``);
        }

    })
}