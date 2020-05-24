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
        var greeting;
        var cmd;
        var md2;
        var ch2;
        var ms2;
        var apr2;
        var cmd2;

        //setting up the admin role
        function getadm(message) { 
            return new Promise(function(resolve, reject) { 
                var adm;
                message.channel.send('Please enter the admin role').then(() => {
                    const filter = m => message.author.id === m.author.id;
                    
                
                    message.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] })
                        .then(messages => {
                            var chnl = Array.from(messages.first().content)
                    
                            if (chnl.includes("@")) {
                                b = chnl.slice(3, chnl.indexOf(">"))
                                var admin = b.join("")
                            } else {
                                var channel2 = message.guild.roles.find(r => r.name === chnl.join(""));                        
                                var admin = channel2.id;                                  
                            }
                            msg = message.channel.send(`You've entered: \`${admin}\``).then(m => m.delete(5000));
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
                            var chnl = Array.from(messages.first().content)
                    
                            if (chnl.includes("@")) {
                                b = chnl.slice(3, chnl.indexOf(">"))
                                var moderator = b.join("")
                            } else {
                                var channel2 = message.guild.roles.find(r => r.name === chnl.join(""));                        
                                var moderator = channel2.id;                                  
                            }
                            msg = message.channel.send(`You've entered: \`${moderator}\``).then(m => m.delete(5000));
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
                                var channel = channel2.id;                                  
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
                
                
                message.channel.send('Please enter the server greeting (currently no emoji support)').then(() => {
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
        //setting up the approved role
        function getapr(message) {
            return new Promise(function(resolve, reject) {
                message.channel.send('Please enter the role for approved members').then(() => {
                    const filter = m => message.author.id === m.author.id;
                    var apr;
                
                    message.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] })
                        .then(messages => {
                            var chnl = Array.from(messages.first().content)
                    
                            if (chnl.includes("@")) {
                                b = chnl.slice(3, chnl.indexOf(">"))
                                var approved = b.join("")
                            } else {
                                var channel2 = message.guild.roles.find(r => r.name === chnl.join(""));                        
                                var approved = channel2.id;                                  
                            }
                            msg = message.channel.send(`You've entered: \`${approved}\``).then(m => m.delete(5000));
                            con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
                                let sql;
        
                                sql = `UPDATE servers SET approved = '${approved}' WHERE id = '${message.guild.id}'`;
                                apr = true;
                                resolve(apr);
                                return con.query(sql);
                            })
                        })
                        .catch(() => {
                            message.channel.send('You did not provide any input!');
                        })
                          
                });
            })            
        }
        //setting up the startcmd
        function getcmd(message) {
            return new Promise(function(resolve, reject) {
                
                
                message.channel.send('Please enter the server greeting (currently no emoji support)').then(() => {
                    const filter = m => message.author.id === m.author.id;
                    var cmd;
                
                    message.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] })
                        .then(messages => {
                            cmd = messages.first().content
                            msg = message.channel.send(`You've entered: \`${cmd}\``).then(m => m.delete(5000));
                            con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
                                let sql;

                                sql = `UPDATE servers SET startcmd = '${cmd}' WHERE id = '${message.guild.id}'`;
                                cmd = true;
                                resolve(cmd);
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

        if (ms2) {
            apr2 = await getapr(message);
        }

        if (apr2) {
            cmd2 = await getcmd(message);
        }

        if (cmd2) {
            message.channel.send(embed);
        }
        

    }
}