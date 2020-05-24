const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "setserver",
    category: "setup",
    description: "Set up the entire server",
    run: async (client, message, args, con) => {
        
        if (!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply("You are not powerfull enough to do that");
        }
        
        //declaring stuff
        const member = message.member;
        var admin;
        var moderator;
        var greeting;
        var md2;
        var ch2;
        var ms2;

        //setting up the admin role
        function getadm(message) { 
            return new Promise(function(resolve, reject) { 
                var adm;
                message.channel.send('Please enter the admin role').then(() => {
                    const filter = m => message.author.id === m.author.id;
                    
                
                    message.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] })
                        .then(messages => {
                            admin = messages.first().content
                            msg = message.channel.send(`You've entered: \`${messages.first().content}\``).then(m => m.delete(5000));
                            con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
                                let sql;

                                sql = `UPDATE servers SET admin = '${admin}' WHERE id = '${message.guild.id}'`;
                                adm = true;
                                resolve(adm);
                                return con.query(sql);
                            })
                        })
                        .catch(() => {
                            message.channel.send('You did not provide any input!');
                        })
                        
                });
            });
        }
        //setting up the moderator role
        function getmd(message) {
            return new Promise(function(resolve, reject) {
                message.channel.send('Please enter the moderator role').then(() => {
                    var md;
                    const filter = m => message.author.id === m.author.id;
                    
                
                    message.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] })
                        .then(messages => {
                            moderator = messages.first().content
                            msg = message.channel.send(`You've entered: \`${messages.first().content}\``).then(m => m.delete(5000));
                            con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
                                let sql;
        
                                sql = `UPDATE servers SET moderator = '${moderator}' WHERE id = '${message.guild.id}'`;
                                md = true;
                                resolve(md);
                                return con.query(sql);
                            })
                        })
                        .catch(() => {
                            message.channel.send('You did not provide any input!');
                        })
                          
                });
            })
        }
        //setting up the greeting channel
        function getch(message) {
            return new Promise(function(resolve, reject) {
                message.channel.send('Please enter the greeting channel (please use with a tag, e.g. #channel)').then(() => {
                    const filter = m => message.author.id === m.author.id;
                    var ch;
                    
                
                    message.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] })
                        .then(messages => {
                            var chnl = Array.from(messages.first().content)
        
                            if (chnl.includes("#")) {
                                b = chnl.slice(2, chnl.indexOf(">"))
                                var channel = b.join("")
                            } else {
                                var channel2 = message.guild.channels.find(channel => channel.name === chnl.join(""));                        
                                var chnl2 = Array.from(channel2.id);                        
                                c = chnl2.slice(2, chnl2.indexOf(">"))                        
                                var channel = c.join("")                      
                            }
                            
                            message.channel.send(`You've entered: \`${channel}\``).then(m => m.delete(5000));
                            con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
                                let sql;
                                sql = `UPDATE servers SET channel = '${channel}' WHERE id = '${message.guild.id}'`;
                                ch = true;
                                resolve(ch);
                                return con.query(sql);
                            })
                        })
                        .catch(() => {
                            message.channel.send('You did not provide any input!');
                        })
                          
                });
            })
        }
        //setting up the greeting message
        function getms(message) {
            return new Promise(function(resolve, reject) {
                
                
                message.channel.send('Please enter the server greeting').then(() => {
                    const filter = m => message.author.id === m.author.id;
                    var ms;
                
                    message.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] })
                        .then(messages => {
                            greeting = messages.first().content
                            msg = message.channel.send(`You've entered: \`${messages.first().content}\``).then(m => m.delete(5000));
                            con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
                                let sql;

                                sql = `UPDATE servers SET greeting = '${greeting}' WHERE id = '${message.guild.id}'`;
                                ms = true;
                                resolve(ms);
                                return con.query(sql);
                            })
                        })
                        .catch(() => {
                            message.channel.send('You did not provide any input!');
                        })
                        
                });
            })
        }
        //setup complete message
        const embed = new RichEmbed()
            .setColor(member.displayHexColor === "#000000" ? "#ffffff" : member.displayHexColor)
            .setTimestamp()
            .setDescription(stripIndents`You have completed the setup process for this server. :partying_face:
            Hopefully nothing broke :sweat_smile:
            If you wish to change any of this in the future, you can use one of the other commands in the \`setup\` category.`)
        
        
        const adm2 = await getadm(message);
        
        if (adm2) {
            md2 = await getmd(message);
        }

        if (md2) {
            ch2 = await getch(message);
        }

        if (ch2) {
            ms2 = await getms(message);
        }

        if (md2) {
            message.channel.send(embed);
        }
        

    }
}