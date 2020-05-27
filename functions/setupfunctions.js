module.exports = {

    getadm: function(message, con) { 
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
    },

    getmd: function(message, con) {
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
    },

    getch: function(message, con) {
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
    },

    getms: function(message, con) {
        return new Promise(function(resolve, reject) {
            
            
            message.channel.send('Please enter the server greeting (currently no emoji support)').then(() => {
                const filter = m => message.author.id === m.author.id;
                var ms;
            
                message.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] })
                    .then(messages => {
                        var greeting = messages.first().content
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
    },

    getapr: function(message, con) {
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
    },

    getcmd: function(message, con) {
        return new Promise(function(resolve, reject) {
            
            
            message.channel.send('Please enter the command which shall be used to approve new members (try to use something unusual)').then(() => {
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
};