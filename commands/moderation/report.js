const Discord  = require("discord.js");
const { stripIndents } = require("common-tags");
const { getAdmin, getMod, getreportschannel, getinfractions } = require("../../functions/functions.js"); 


module.exports = {
    name: "report",
    category: "moderation",
    description: "reports a member",
    usage: "<good/bad, mention | id, reason>",
    run: async (client, message, args, con) => {
        if (message.deletable) message.delete();

        let rMember = message.mentions.members.first() || message.guild.members.get(args[0]);

        let behavior;
        let behavior2;        
        var admin = await getAdmin(message, con);
        var moderator = await getMod(message, con);

        if (admin === null) {
            return message.channel.send("You need to set the role for admin first. Do that by typing !setadmin")
        }
        if (moderator === null) {
            return message.channel.send("You need to set the role for moderator first. Do that by typing !setmod")
        }

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
            
            con.query(`SELECT * FROM reports WHERE member_id = '${rMember.id}'`, (err, rows) => {
                if (err) throw err;
                let sql;
                
                if (rows.length < 1 ) {
                    sql = `INSERT INTO reports (member_id, member_name, infractions) VALUES ('${rMember.id}', '${rMember.displayName}', 1)`
                } else if (rows[0].member_id === rMember.id) {
                    infraction = rows[0].infractions + 1;
                    sql = `UPDATE reports SET infractions = ${infraction} WHERE member_id = '${rMember.id}'`
                }
                con.query(sql)
            });

        } else if ((args[0] !== "good") || (args[0] !== "bad")) {
            return message.reply("You need to add a behavior type. (Good/Bad)").then(m => m.delete( {timeout: 5000} ));
        }
        
        if (!args[2])
            return message.channel.send("Please include a reason for the report").then(m => m.delete({timeout: 10000}));

        const reports = await getreportschannel(message, con);

        const infractions = await getinfractions(rMember, con);
        
        const channel = message.guild.channels.cache.find(channel => channel.id === reports);

        if (infractions === 3) {
            message.channel.send("This is the part where someone would get kicked");
        }
        
        if (!channel)
            return message.channel.send("I could not find a \`#reports\` channel").then(m => m.delete({timeout: 10000}));

        const embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL)
            .setAuthor("**Reported member**", rMember.user.displayAvatarURL())
            .setDescription(stripIndents`**> Member: ${rMember} (${rMember.id})
            **> Behavior: ${behavior2}
            **> Reported by: ${message.member} (${message.member.id})
            **> Reported in: ${message.channel}
            **> Reason: ${args.slice(2).join(" ")}
            **> Current Infractions: ${infractions}`);

        client.users.fetch(`${rMember.id}`, false).then(user => {
            user.send(`You have been reported by ${message.member} for "${args.slice(2).join(" ")}." ${behavior} This message was computer generated. Please do not answer to it.`)
        });

        return channel.send(embed);

        
    }
}