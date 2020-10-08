const { filter_integer, update_API_call } = require("./functions.js");

module.exports = {

    setadm: function(message) { 
        return new Promise(function(resolve, reject) { 
            var adm;
            message.channel.send('Please enter the admin role').then(() => {
                const filter = m => message.author.id === m.author.id;                
            
                message.channel.awaitMessages(filter, { time: 120000, max: 1, errors: ['time'] })
                    .then(async messages => {                        
                        
                        var admin = await filter_integer(message, messages.first().content);
                        
                        msg = message.channel.send(`You've entered: \`${message.guild.roles.cache.find(r => r.id === admin).name}\``);
                       
                        const payload = JSON.stringify({
                            guild: message.guild,
                            field: 'admin',
                            value: admin
                        })

                        const success = await update_API_call('setup', payload, message.guild, 'setup');

                        if (success.success === true) {                            
                            return resolve(true);
                        } else {
                            message.channel.send(`An Error occured: ${success.err}`);
                            return resolve(true);
                        }
                    })                    
                    .catch(() => {
                        adm = false;
                        resolve(adm);
                        message.channel.send(`This role doesn't exist! Please try again!`);
                    })
                    
            });
        });
    },

    setmd: function(message) {
        return new Promise(function(resolve, reject) {
            message.channel.send('Please enter the moderator role').then(() => {
                var md;
                const filter = m => message.author.id === m.author.id;
                
            
                message.channel.awaitMessages(filter, { time: 120000, max: 1, errors: ['time'] })
                    .then(async messages => {
                        
                        var moderator = await filter_integer(message, messages.first().content);

                        msg = message.channel.send(`You've entered: \`${message.guild.roles.cache.find(r => r.id === moderator).name}\``);
                        
                        const payload = JSON.stringify({
                            guild: message.guild,
                            field: 'moderator',
                            value: moderator
                        })

                        const success = await update_API_call('setup', payload, message.guild, 'setup');

                        if (success.success === true) {
                            return resolve(true);
                        } else {
                            message.channel.send(`An Error occured: ${success.err}`);
                            return resolve(true);
                        }
                    })
                    .catch(() => {
                        md = false;
                        resolve(md)
                        message.channel.send(`This role doesn't exist! Please try again!`);
                    })
                      
            });
        })
    },

    setch: function(message) {
        return new Promise(function(resolve, reject) {
            message.channel.send('Please enter the greeting channel').then(() => {
                const filter = m => message.author.id === m.author.id;
                var ch;
                
            
                message.channel.awaitMessages(filter, { time: 120000, max: 1, errors: ['time'] })
                    .then(async messages => {
                        var channel = await filter_integer(message, messages.first().content);        
                                               
                        message.channel.send(`You've entered: \`${message.guild.channels.cache.find(r => r.id === channel).name}\``);
                        
                        const payload = JSON.stringify({
                            guild: message.guild,
                            field: 'channel',
                            value: channel
                        })

                        const success = await update_API_call('setup', payload, message.guild, 'setup');

                        if (success.success === true) {
                            return resolve(true);
                        } else {
                            message.channel.send(`An Error occured: ${success.err}`);
                            return resolve(true);
                        }
                    })
                    .catch(() => {
                        ch = false;
                        resolve(ch)
                        message.channel.send(`This channel doesn't exist! Please try again!`);
                    })
                      
            });
        })
    },

    setms: function(message) {
        return new Promise(function(resolve, reject) {
            
            
            message.channel.send('Welcome message that is to be displayed to the new member (max 512 Chars.). This message will be sent to the new member in a PM.').then(() => {
                const filter = m => message.author.id === m.author.id;
                var ms;
            
                message.channel.awaitMessages(filter, { time: 120000, max: 1, errors: ['time'] })
                    .then(async messages => {
                        var greeting = messages.first().content
                        msg = message.channel.send(`You've entered: \`${messages.first().content}\``);
                        
                        const payload = JSON.stringify({
                            guild: message.guild,
                            field: 'greeting',
                            value: greeting
                        })

                        const success = await update_API_call('setup', payload, message.guild, 'setup');

                        if (success.success === true) {
                            return resolve(true);
                        } else {
                            message.channel.send(`An Error occured: ${success.err}`);
                            return resolve(true);
                        }
                    })
                    .catch(() => {
                        ms = false;
                        resolve(ms);
                        message.channel.send('You did not provide any input! Please try again!');
                    })
                    
            });
        })
    },

    setapr: function(message) {
        return new Promise(function(resolve, reject) {
            message.channel.send('Please enter the role for approved members').then(() => {
                const filter = m => message.author.id === m.author.id;
                var apr;
            
                message.channel.awaitMessages(filter, { time: 120000, max: 1, errors: ['time'] })
                    .then(async messages => {

                        var approved = await filter_integer(message, messages.first().content);

                        msg = message.channel.send(`You've entered: \`${message.guild.roles.cache.find(r => r.id === approved).name}\``);
                        
                        const payload = JSON.stringify({
                            guild: message.guild,
                            field: 'approved',
                            value: approved
                        })

                        const success = await update_API_call('setup', payload, message.guild, 'setup');

                        if (success.success === true) {
                            return resolve(true);
                        } else {
                            message.channel.send(`An Error occured: ${success.err}`);
                            return resolve(true);
                        }
                    })
                    .catch(() => {
                        apr = false;
                        resolve(apr);
                        message.channel.send(`This role doesn't exist! Please try again!`);
                    })
                      
            });
        })            
    },

    setcmd: function(message) {
        return new Promise(function(resolve, reject) {
            
            
            message.channel.send('Please enter the command which shall be used to approve new members (try to use something unusual)').then(() => {
                const filter = m => message.author.id === m.author.id;
                var cmd;
            
                message.channel.awaitMessages(filter, { time: 120000, max: 1, errors: ['time'] })
                    .then(async messages => {
                        cmd = messages.first().content
                        msg = message.channel.send(`You've entered: \`${cmd}\``);
                        
                        const payload = JSON.stringify({
                            guild: message.guild,
                            field: 'startcmd',
                            value: cmd
                        })

                        const success = await update_API_call('setup', payload, message.guild, 'setup');

                        if (success.success === true) {
                            return resolve(true);
                        } else {
                            message.channel.send(`An Error occured: ${success.err}`);
                            return resolve(true);
                        }
                    })
                    .catch(() => {
                        cmd = false;
                        resolve(cmd);
                        message.channel.send('You did not provide any input! Please try again!');
                    })
                    
            });
        })
    },

    setDB: function(guild) {
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
    
    setreports: function(message) {
        return new Promise(function(resolve, reject) {
            message.channel.send('Please enter the channel where you want your reports to be displayed').then(() => {
                const filter = m => message.author.id === m.author.id;
                var ch;
                
                message.channel.awaitMessages(filter, { time: 120000, max: 1, errors: ['time'] })
                    .then(async messages => {
                        var channel = await filter_integer(message, messages.first().content);       
                                               
                        message.channel.send(`You've entered: \`${message.guild.channels.cache.find(r => r.id === channel).name}\``);
                        
                        const payload = JSON.stringify({
                            guild: message.guild,
                            field: 'reports',
                            value: channel
                        })

                        const success = await update_API_call('setup', payload, message.guild, 'setup');

                        if (success.success === true) {
                            return resolve(true);
                        } else {
                            message.channel.send(`An Error occured: ${success.err}`);
                            return resolve(true);
                        }
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
                            return message.channel.send('Aborting setup process');
                        }
                    })
                    .catch(() => {
                        return message.channel.send('Aborting setup process');
                    })
            })     
        })
    },

    setautomatic_approved: function(message) {
        return new Promise(function(resolve, reject) {
            message.channel.send('Do you want new members to get approved immediatly? (y/n)').then(() => {
                const filter = m => message.author.id === m.author.id;
                let sql;
                message.channel.awaitMessages(filter, { time: 120000, max: 1, errors: ['time']})
                    .then(async messages => {
                        answer = messages.first().content.toLowerCase();  
                        var yes_no

                        if (answer === "y") { 
                            message.channel.send(`New members \`will\` receive approved role automatically`);
                            yes_no = 'true'
                        } else {
                            message.channel.send(`New members \`will not\` receive approved role automatically`);                            
                            yes_no = 'false'
                        } 

                        
                        const payload = JSON.stringify({
                            guild: message.guild,
                            field: 'auto_approved',
                            value: yes_no
                        })

                        const success = await update_API_call('setup', payload, message.guild, 'setup');

                        if (success.success === true && yes_no === 'true') {
                            return resolve(true);
                        } else if (success.success === true && yes_no === 'false') {
                            return resolve(false);
                        } else {
                            message.channel.send(`An Error occured: ${success.err}`);
                            return resolve(true);
                        }
                    })
                    .catch(() => {
                        ch = false;
                        resolve(ch)
                        message.channel.send('You did not provide any input! Using default!');
                    })
            })
        })
    },

    setservergreeting: function (message, embed4) {
        return new Promise(function (resolve, reject) {
            message.channel.send(embed4).then(() => {
                const filter = m => message.author.id === m.author.id;
                var ms;
            
                message.channel.awaitMessages(filter, { time: 120000, max: 1, errors: ['time'] })
                    .then(async messages => {
                        var greeting = messages.first().content
                        msg = message.channel.send(`You've entered: \`${messages.first().content}\``);
                        
                        const payload = JSON.stringify({
                            guild: message.guild,
                            field: 'server_greeting',
                            value: greeting
                        })

                        const success = await update_API_call('setup', payload, message.guild, 'setup');

                        if (success.success === true) {
                            return resolve(true);
                        } else {
                            message.channel.send(`An Error occured: ${success.err}`);
                            return resolve(true);
                        }
                    })
                    .catch(() => {
                        ms = false;
                        resolve(ms);
                        message.channel.send('You did not provide any input! Please try again!');
                    })
                    
            });
        })
    },

    setprefix: function (message) {
        return new Promise(function (resolve, reject) {
            message.channel.send("Please enter your desired prefix").then(() => {
                const filter = m => message.author.id === m.author.id;
                var ms;
            
                message.channel.awaitMessages(filter, { time: 120000, max: 1, errors: ['time'] })
                    .then(async messages => {
                        var prefix = messages.first().content
                        msg = message.channel.send(`Prefix changed to: \`${messages.first().content}\``);
                        
                        const payload = JSON.stringify({
                            guild: message.guild,
                            field: 'prefix',
                            value: prefix
                        })

                        const success = await update_API_call('setup', payload, message.guild, 'setup');

                        if (success.success === true) {
                            return resolve(true);
                        } else {
                            message.channel.send(`An Error occured: ${success.err}`);
                            return resolve(true);
                        }
                    })
                    .catch(() => {
                        ms = true;
                        resolve(ms);
                        message.channel.send('You did not provide any input! Using default prefix!');
                    })
                    
            });
        })
    },

    setkicklimit: function (message) {
        return new Promise(function (resolve, reject) {
            message.channel.send("Please set the Kick-Limit").then(() => {
                const filter = m => message.author.id === m.author.id;
                var ms;

                message.channel.awaitMessages(filter, { time: 120000, max: 1, errors: ['time'] })
                    .then(async messages => {
                        var limit = messages.first().content;
                        
                        if (Number.isInteger(+limit)) {
                            msg = message.channel.send(`You've entered: \`${messages.first().content}\``);
                        } else {
                            message.channel.send('You did not enter a number');
                            return resolve(false);
                        }

                        const payload = JSON.stringify({
                            guild: message.guild,
                            field: 'kick_limit',
                            value: limit
                        })

                        const success = await update_API_call('setup', payload, message.guild, 'setup');

                        if (success.success === true) {
                            return resolve(true);
                        } else {
                            message.channel.send(`An Error occured: ${success.err}`);
                            return resolve(true);
                        }
                    })
                    .catch(() => {
                        ms = true;
                        resolve(ms);
                        message.channel.send('You did not provide any input! Using default of 3');
                    })

            });
        })
    },

    setbanlimit: function (message) {
        return new Promise(function (resolve, reject) {
            message.channel.send("Please set the Ban-Limit").then(() => {
                const filter = m => message.author.id === m.author.id;
                var ms;

                message.channel.awaitMessages(filter, { time: 120000, max: 1, errors: ['time'] })
                    .then(async messages => {
                        var limit = messages.first().content;

                        if (Number.isInteger(+limit)) {
                            msg = message.channel.send(`You've entered: \`${messages.first().content}\``);
                        } else {
                            message.channel.send('You did not enter a number');
                            return resolve(false);
                        }

                        const payload = JSON.stringify({
                            guild: message.guild,
                            field: 'ban_limit',
                            value: limit
                        })

                        const success = await update_API_call('setup', payload, message.guild, 'setup');

                        if (success.success === true) {
                            return resolve(true);
                        } else {
                            message.channel.send(`An Error occured: ${success.err}`);
                            return resolve(true);
                        }
                    })
                    .catch(() => {
                        ms = true;
                        resolve(ms);
                        message.channel.send('You did not provide any input! Using default of 6');
                    })

            });
        })
    },
};