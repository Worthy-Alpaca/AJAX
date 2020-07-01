const Discord  = require("discord.js");
const { stripIndents } = require("common-tags");
const { getAdmin, getMod, getreportschannel, getinfractions } = require("../../functions/db_queries.js"); 
const { ban_limit, kick_limit } = require("../../src/config.json")


module.exports = {
    name: "report",
    category: "moderation",
    permission: ["none", "moderator", "admin"],
    description: "reports a member",
    usage: "<good/bad, mention | id, reason>",
    run: async (client, message, args, con) => {
        if (message.deletable) message.delete();

        let rMember =  message.mentions.members.first() || message.guild.members.get(args[0]);

        let behavior;
        let behavior2;            
        var admin = await getAdmin(message, con);
        var moderator = await getMod(message, con);
        const reports = await getreportschannel(message, con);
        const channel = message.guild.channels.cache.find(channel => channel.id === reports);
        const tblid = Array.from(message.guild.name)
        tblid.forEach(function(item, i) { if (item == " ") tblid[i] = "_"; });
        
        
        if (admin === null) {
            return message.channel.send("You need to set the role for admin first. Do that by typing !setadmin")
        }
        if (moderator === null) {
            return message.channel.send("You need to set the role for moderator first. Do that by typing !setmod")
        }

        if (!channel)
            return message.channel.send("I could not find a \`#reports\` channel").then(m => m.delete({timeout: 10000}));

        if (!rMember)
            return message.reply("Couldn't find that person").then(m => m.delete( {timeout: 5000} ));

        if (rMember.roles.cache.has(message.guild.roles.cache.find(r => r.id === admin).id) || rMember.user.bot)
            return message.reply("Can't report that member").then(m => m.delete( {timeout: 5000} ));

        if (args[0] === "good") {
            behavior = "Keep up the good work!"
            behavior2 = "good"
        } else if (args[0] === "bad") {
            behavior = "Please cease this behavior immediatly. If you think this is wrong, please contact a staff member."
            behavior2 = "bad"
            con.query(`CREATE TABLE IF NOT EXISTS ${tblid.join("")}(member_id VARCHAR(20) NOT NULL UNIQUE, member_name TEXT NOT NULL, infractions INT NOT NULL);`)
            con.query(`SELECT * FROM ${tblid.join("")} WHERE member_id = '${rMember.id}'`, (err, rows) => {
                if (err) throw err;
                let sql;                
                if (rows.length < 1 ) {
                    sql = `INSERT INTO ${tblid.join("")} (member_id, member_name, infractions) VALUES ('${rMember.id}', '${rMember.displayName}', 1)`
                } else if (rows[0].member_id === rMember.id) {
                    infraction = rows[0].infractions + 1;
                    sql = `UPDATE ${tblid.join("")} SET infractions = ${infraction} WHERE member_id = '${rMember.id}'`
                }        
                con.query(sql)                
            });

        } else if ((args[0] !== "good") || (args[0] !== "bad")) {
            return message.reply("You need to add a behavior type. (Good/Bad)").then(m => m.delete( {timeout: 5000} ));
        }
        
        if (!args[2])
            return message.channel.send("Please include a reason for the report").then(m => m.delete({timeout: 10000}));

        

        const infractions = await getinfractions(tblid, rMember, con);
        
        

        let msg = `You have been reported by ${message.member} for "${args.slice(2).join(" ")}." ${behavior} This message was computer generated. Please do not answer to it.`;
        
        

        const embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL)
            .setAuthor(`Reported Member`, rMember.user.displayAvatarURL());            

        if (args[0] === "good") {            
            embed.setDescription(stripIndents`**> Member:** ${rMember} (${rMember.id})
            > Behavior: ${behavior2}
            **> Reported by:** ${message.member} (${message.member.id})
            > Reported in: ${message.channel}
            **> Reason:** ${args.slice(2).join(" ")}
            > Current Infractions: \`${infractions}\``);
        } else {
            embed.setDescription(stripIndents`**> Member:** ${rMember} (${rMember.id})
            > Behavior: ${behavior2}
            **> Reported by:** ${message.member} (${message.member.id})
            > Reported in: ${message.channel}
            **> Reason:** ${args.slice(2).join(" ")}
            > Current Infractions: \`${infractions + 1}\``);
        }

        if (infractions+1 >= kick_limit && infractions+1 < ban_limit) {
            rMember.kick(`Reported infractions have reached ${kick_limit}`)
                .catch(err => {
                    if (err) return message.channel.send(`That didn't work`)
                });
            msg = `You have been kicked because you have been reported ${infractions+1} times for bad behavior. This message was computer generated. Please do not answer to it.`
            embed.addField(`\u200b`, stripIndents`${rMember} has been kicked.`);
        } else if (infractions+1 >= ban_limit) {
            rMember.ban({ days: infractions+1, reason: `Reported infractions have reached ${ban_limit}` })
                .catch(err => {
                    if (err) return message.channel.send(`That didn't work`)
                });
            msg = `You have been banned for ${infractions+1} days because you have been reported ${infractions+1} times for bad behavior. This message was computer generated. Please do not answer to it.`
            embed.addField(`\u200b`, stripIndents`${rMember} has been banned for \`${infractions+1}\` days.`);
        }

        client.users.fetch(`${rMember.id}`, false).then(user => {
            user.send(msg)
        });

        return channel.send(embed);

        
    }
}