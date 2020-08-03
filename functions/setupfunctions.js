const { filter_integer } = require("./functions.js");

module.exports = {

    setadm: function(message, con) { 
        return new Promise(function(resolve, reject) { 
            var adm;
            message.channel.send('Please enter the admin role').then(() => {
                const filter = m => message.author.id === m.author.id;                
            
                message.channel.awaitMessages(filter, { time: 120000, max: 1, errors: ['time'] })
                    .then(async messages => {                        
                        
                        var admin = await filter_integer(message, messages.first().content);
                        
                        msg = message.channel.send(`You've entered: \`${message.guild.roles.cache.find(r => r.id === admin).name}\``).then(m => m.delete( {timeout: 5000} ));
                        con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
                            let sql;
                            sql = `UPDATE servers SET admin = '${admin}' WHERE id = '${message.guild.id}'`;
                            adm = true;
                            resolve(adm);
                            return con.query(sql);
                        })
                    })                    
                    .catch(() => {
                        adm = false;
                        resolve(adm);
                        message.channel.send(`This role doesn't exist! Please try again!`).then(m => m.delete( {timeout: 5000} ));
                    })
                    
            });
        });
    },

    setmd: function(message, con) {
        return new Promise(function(resolve, reject) {
            message.channel.send('Please enter the moderator role').then(() => {
                var md;
                const filter = m => message.author.id === m.author.id;
                
            
                message.channel.awaitMessages(filter, { time: 120000, max: 1, errors: ['time'] })
                    .then(async messages => {
                        
                        var moderator = await filter_integer(message, messages.first().content);

                        msg = message.channel.send(`You've entered: \`${message.guild.roles.cache.find(r => r.id === moderator).name}\``).then(m => m.delete( {timeout: 5000} ));
                        con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
                            let sql;    
                            sql = `UPDATE servers SET moderator = '${moderator}' WHERE id = '${message.guild.id}'`;
                            md = true;
                            resolve(md);
                            return con.query(sql);
                        })
                    })
                    .catch(() => {
                        md = false;
                        resolve(md)
                        message.channel.send(`This role doesn't exist! Please try again!`);
                    })
                      
            });
        })
    },

    setch: function(message, con) {
        return new Promise(function(resolve, reject) {
            message.channel.send('Please enter the greeting channel').then(() => {
                const filter = m => message.author.id === m.author.id;
                var ch;
                
            
                message.channel.awaitMessages(filter, { time: 120000, max: 1, errors: ['time'] })
                    .then(async messages => {
                        var channel = await filter_integer(message, messages.first().content);        
                                               
                        message.channel.send(`You've entered: \`${message.guild.channels.cache.find(r => r.id === channel).name}\``).then(m => m.delete( {timeout: 5000} ));
                        con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
                            let sql;
                            sql = `UPDATE servers SET channel = '${channel}' WHERE id = '${message.guild.id}'`;
                            ch = true;
                            resolve(ch);
                            return con.query(sql);
                        })
                    })
                    .catch(() => {
                        ch = false;
                        resolve(ch)
                        message.channel.send(`This channel doesn't exist! Please try again!`);
                    })
                      
            });
        })
    },

    setms: function(message, con) {
        return new Promise(function(resolve, reject) {
            
            
            message.channel.send('Welcome message that is to be displayed to the new member (currently no emoji support). This message will be sent to the new member in a PM.').then(() => {
                const filter = m => message.author.id === m.author.id;
                var ms;
            
                message.channel.awaitMessages(filter, { time: 120000, max: 1, errors: ['time'] })
                    .then(messages => {
                        var greeting = messages.first().content
                        msg = message.channel.send(`You've entered: \`${messages.first().content}\``).then(m => m.delete( {timeout: 5000} ));
                        con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
                            let sql;
                            sql = `UPDATE servers SET greeting = "${greeting}" WHERE id = '${message.guild.id}'`;
                            ms = true;
                            resolve(ms);
                            return con.query(sql);
                        })
                    })
                    .catch(() => {
                        ms = false;
                        resolve(ms);
                        message.channel.send('You did not provide any input! Please try again!');
                    })
                    
            });
        })
    },

    setapr: function(message, con) {
        return new Promise(function(resolve, reject) {
            message.channel.send('Please enter the role for approved members').then(() => {
                const filter = m => message.author.id === m.author.id;
                var apr;
            
                message.channel.awaitMessages(filter, { time: 120000, max: 1, errors: ['time'] })
                    .then(async messages => {

                        var approved = await filter_integer(message, messages.first().content);

                        msg = message.channel.send(`You've entered: \`${message.guild.roles.cache.find(r => r.id === approved).name}\``).then(m => m.delete( {timeout: 5000} ));
                        con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
                            let sql;    
                            sql = `UPDATE servers SET approved = '${approved}' WHERE id = '${message.guild.id}'`;
                            apr = true;
                            resolve(apr);
                            return con.query(sql);
                        })
                    })
                    .catch(() => {
                        apr = false;
                        resolve(apr);
                        message.channel.send(`This role doesn't exist! Please try again!`);
                    })
                      
            });
        })            
    },

    setcmd: function(message, con) {
        return new Promise(function(resolve, reject) {
            
            
            message.channel.send('Please enter the command which shall be used to approve new members (try to use something unusual)').then(() => {
                const filter = m => message.author.id === m.author.id;
                var cmd;
            
                message.channel.awaitMessages(filter, { time: 120000, max: 1, errors: ['time'] })
                    .then(messages => {
                        cmd = messages.first().content
                        msg = message.channel.send(`You've entered: \`${cmd}\``).then(m => m.delete( {timeout: 5000} ));
                        con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
                            let sql;
                            sql = `UPDATE servers SET startcmd = '${cmd}' WHERE id = '${message.guild.id}'`;
                            cmd = true;
                            resolve(cmd);
                            return con.query(sql);
                        })
                    })
                    .catch(() => {
                        cmd = false;
                        resolve(cmd);
                        message.channel.send('You did not provide any input! Please try again!');
                    })
                    
            });
        })
    },

    setDB: function(guild, con) {
        return new Promise(function(resolve, reject) {
            con.query(`SELECT * FROM servers WHERE id = '${guild.id}'`, (err, rows) => {
                if(err) throw err;
                let sql;
                let db;
                       
                if (!rows.length) {
                  console.log(guild.name, "added")
                  sql = `INSERT INTO servers (id, name) VALUES ('${guild.id}', '${guild.name}')`
                  db = true;
                  resolve(db);
                  return con.query(sql);
                }
        
                if(rows[0].id === guild.id) {                  
                  db = true;
                  resolve(db);
                  return;
                } else {
                  console.log("b")
                  sql = `INSERT INTO servers (id, name) VALUES ('${guild.id}', '${guild.name}')`
                  db = true;
                  resolve(db);
                  return con.query(sql);
                }               
                        
            }); 
        })
    },
    
    setreports: function(message, con) {
        return new Promise(function(resolve, reject) {
            message.channel.send('Please enter the channel where you want your reports to be displayed').then(() => {
                const filter = m => message.author.id === m.author.id;
                var ch;
                
                message.channel.awaitMessages(filter, { time: 120000, max: 1, errors: ['time'] })
                    .then(async messages => {
                        var channel = await filter_integer(message, messages.first().content);       
                                               
                        message.channel.send(`You've entered: \`${message.guild.channels.cache.find(r => r.id === channel).name}\``).then(m => m.delete( {timeout: 5000} ));
                        con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
                            let sql;
                            sql = `UPDATE servers SET reports = '${channel}' WHERE id = '${message.guild.id}'`;
                            ch = true;
                            resolve(ch);
                            return con.query(sql);
                        })
                    })
                    .catch(() => {
                        ch = false;
                        resolve(ch);
                        message.channel.send(`This channel doesn't exist! Please try again!`);
                    })
                      
            });
        })
    }, 

    user_ready: function(message, embed2) {        
            
        return new Promise(function(resolve, reject) {
            message.channel.send(embed2).then(() => {
                const filter = m => message.author.id === m.author.id;
                var rdy;
                message.channel.awaitMessages(filter, { time: 240000, max: 1, errors: ['time'] })
                    .then(messages => {
                        var message2 = messages.first().content.toLowerCase();
                        if (message2 === "y") {
                            rdy = true;
                            return resolve(rdy);
                        } else {
                            return message.channel.send('Aborting setup process').then(m => m.delete( {timeout: 5000} ));
                        }
                    })
                    .catch(() => {
                        return message.channel.send('Aborting setup process').then(m => m.delete( {timeout: 5000} ));
                    })
            })     
        })
    },

    setautomatic_approved: function(message, con) {
        return new Promise(function(resolve, reject) {
            message.channel.send('Do you want new members to get approved immediatly? (y/n)').then(() => {
                const filter = m => message.author.id === m.author.id;
                let sql;
                message.channel.awaitMessages(filter, { time: 120000, max: 1, errors: ['time']})
                    .then(messages => {
                        answer = messages.first().content.toLowerCase();                        

                        if (answer === "y") { 
                            message.channel.send(`New members \`will\` receive approved role automatically`)                           
                            ch = true;
                            sql = `UPDATE servers SET auto_approved = 'true' WHERE id = '${message.guild.id}'`;
                        } else {
                            message.channel.send(`New members \`will not\` receive approved role automatically`)
                            ch = false;
                            sql = `UPDATE servers SET auto_approved = 'false' WHERE id = '${message.guild.id}'`;
                        } 

                        con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {                            
                            
                            resolve(ch);
                            return con.query(sql);
                        })
                    })
                    .catch(() => {
                        ch = false;
                        resolve(ch)
                        message.channel.send('You did not provide any input! Using default!');
                    })
            })
        })
    },

    setservergreeting: function (message, con, embed4) {
        return new Promise(function (resolve, reject) {
            message.channel.send(embed4).then(() => {
                const filter = m => message.author.id === m.author.id;
                var ms;
            
                message.channel.awaitMessages(filter, { time: 120000, max: 1, errors: ['time'] })
                    .then(messages => {
                        var greeting = messages.first().content
                        msg = message.channel.send(`You've entered: \`${messages.first().content}\``).then(m => m.delete( {timeout: 5000} ));
                        con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
                            let sql;
                            sql = `UPDATE servers SET server_greeting = "${greeting}" WHERE id = '${message.guild.id}'`;
                            ms = true;
                            resolve(ms);
                            return con.query(sql);
                        })
                    })
                    .catch(() => {
                        ms = false;
                        resolve(ms);
                        message.channel.send('You did not provide any input! Please try again!');
                    })
                    
            });
        })
    },

    setprefix: function (message, con) {
        return new Promise(function (resolve, reject) {
            message.channel.send("Please enter your desired prefix").then(() => {
                const filter = m => message.author.id === m.author.id;
                var ms;
            
                message.channel.awaitMessages(filter, { time: 120000, max: 1, errors: ['time'] })
                    .then(messages => {
                        var prefix = messages.first().content
                        msg = message.channel.send(`Prefix changed to: \`${messages.first().content}\``).then(m => m.delete( {timeout: 5000} ));
                        con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
                            let sql;
                            sql = `UPDATE servers SET prefix = '${prefix}' WHERE id = '${message.guild.id}'`;
                            ms = true;
                            resolve(ms);
                            return con.query(sql);
                        })
                    })
                    .catch(() => {
                        ms = true;
                        resolve(ms);
                        message.channel.send('You did not provide any input! Using default prefix!');
                    })
                    
            });
        })
    }
};