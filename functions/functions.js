module.exports = {
    getMember: function(message, toFind = '') {
        toFind = toFind.toLowerCase();

        let target = message.guild.roles.cache.find(toFind);
        
        if (!target && message.mentions.members)
            target = message.mentions.members.first();

        if (!target && toFind) {
            target = message.guild.members.cache.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                member.user.tag.toLowerCase().includes(toFind)
            });
        }
            
        if (!target) 
            target = message.member;
            
        return target;
    },

    formatDate: function(date) {
        return new Intl.DateTimeFormat('en-US').format(date)
    },

    promptMessage: async function (message, author, time, validReactions, member) {
        // We put in the time as seconds, with this it's being transfered to MS
        time *= 1000;

        // For every emoji in the function parameters, react in the good order.
        for (const reaction of validReactions) await message.react(reaction);

        // Only allow reactions from the author, 
        // and the emoji must be in the array we provided.
        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

        // And ofcourse, await the reactions
        return message
            .awaitReactions(filter, { max: 1, time: time})
            .then(collected => collected.first() && collected.first().emoji.name);
    },
    // DB queries
    getAdmin: function(message, con) {
        var admininstrator;  
        
        return new Promise(function(resolve, reject) {
            con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
                admininstrator = rows[0].admin;
                resolve(admininstrator);              
            }); 
        });            
    },
    
    getMod: function(message, con) {
        var moderator;  
        
        return new Promise(function(resolve, reject) {
            con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
                moderator = rows[0].moderator;
                resolve(moderator);              
            }); 
        });            
    },
    
    getChnl: function(member, con) {
        var channel;  
        
        return new Promise(function(resolve, reject) {
            con.query(`SELECT * FROM servers WHERE id = '${member.guild.id}'`, (err, rows) => {
                channel = rows[0].channel;
                resolve(channel);              
            }); 
        }); 
    },

    getMsg: function(member, con) {
        var msg;

        return new Promise(function(resolve, reject) {
            con.query(`SELECT * FROM servers WHERE id = '${member.guild.id}'`, (err, rows) => {
                msg = rows[0].greeting;
                resolve(msg);
            });
        });
    },

    getapproved: function(member, con) {
        var msg;

        return new Promise(function(resolve, reject) {
            con.query(`SELECT * FROM servers WHERE id = '${member.guild.id}'`, (err, rows) => {
                msg = rows[0].approved;
                resolve(msg);
            });
        });
    },

    getapproved2: function(message, con) {
        var msg;

        return new Promise(function(resolve, reject) {
            con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
                msg = rows[0].approved;
                resolve(msg);
            });
        });
    },

    getstartcmd: function(message, con) {
        var msg;

        return new Promise(function(resolve, reject) {
            con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
                msg = rows[0].startcmd;
                resolve(msg);
            });
        });
    },

    getreportschannel: function(message, con) {
        var chnl;
        return new Promise(function(resolve, reject) {
            con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {                
                chnl = rows[0].reports;
                resolve(chnl);
            })
        })
    },

    getinfractions: function(tblid, rMember, con) {
        var infractions;
        return new Promise(function(resolve, reject) {
            con.query(`SELECT * FROM ${tblid.join("")} WHERE member_id = '${rMember.id}'`, (err, rows) => {
                if (err) throw err;
                if (rows.length < 1) {                    
                    infractions = 0;
                    resolve(infractions)
                } else if (rows[0].member_id === rMember.id) {                    
                    infractions = rows[0].infractions;
                    resolve(infractions);   
                }
                
            })
        })
    },

    getranks: function(message, con) {
        var ranks = []
        return new Promise(function(resolve, reject) {
            con.query(`SELECT * FROM ranks WHERE server_id = '${message.guild.id}'`, (err, rows) => {
                if (rows.length < 1) {
                    name = "No ranks on this server yet. Do you have suggestions for ranks? Contact the admin nearest to you."
                    ranks.push(name)
                    resolve(ranks)
                } else {
                    a = 0;
                    while(a !== rows.length) {
                        name = rows[a].rank_name
                        ranks.push(name) 
                        a++;
                    }                   
                    
                    resolve(ranks)
                }
            })
        })
    },

    getrank: function(message, rank, con) {
        var r;
        return new Promise(function(resolve, reject) {
            con.query(`SELECT * FROM ranks WHERE server_id = '${message.guild.id}' AND rank_id = '${rank.id}'`, (err, rows) => {
                if (rows[0].rank_id === rank.id) {
                    r = true;
                    resolve(r)
                } else {
                    r = false;
                    resolve(r)
                }
            })
        })
    },

    setrank: function(message, rank, con) {
        let sql;
        var success;
        return new Promise(function(resolve, reject) {
            con.query(`SELECT * FROM ranks WHERE server_id = '${message.guild.id}' AND rank_id = '${rank.id}'`, (err, rows) => {
                if (rows.length < 1) {
                    sql = `INSERT INTO ranks (rank_id, server_id, rank_name) VALUES ('${rank.id}','${message.guild.id}', '${rank.name}')`
                    success = true;
                    resolve(success)
                    return con.query(sql);
                } else {
                    success = false;
                    return resolve(success)
                }
            })
        })
    },

    delrank: function(message, rank, con) {
        let sql;
        var success;
        return new Promise(function(resolve,reject) {
            con.query(`SELECT * FROM ranks WHERE server_id = '${message.guild.id}' AND rank_id = '${rank.id}'`, (err, rows) => {
                if (rows.length < 1) {
                    success = false;
                    return resolve(success);
                } else {
                    sql = `DELETE FROM ranks WHERE server_id = '${message.guild.id}' AND rank_id = '${rank.id}'`
                    success = true;
                    resolve(success);
                    return con.query(sql);
                }
            })
        })
    },

    getservers: function(message, con) {
        var servers = []
        return new Promise(function(resolve, reject) {
            con.query(`SELECT * FROM servers`, (err, rows) => {
                if (rows.length < 1) {
                    name = "No ranks on this server yet. Do you have suggestions for ranks? Contact the admin nearest to you."
                    ranks.push(name)
                    resolve(ranks)
                } else {
                    a = 0;
                    while(a !== rows.length) {
                        name = rows[a].id
                        servers.push(name) 
                        a++;
                    }                   
                    
                    resolve(servers)
                }
            })
        })
    },

    getserverchannel: function(srv, con) {
        var chnl;
        return new Promise(function(resolve, reject) {
            con.query(`SELECT * FROM servers WHERE id = '${srv.id}'`, (err, rows) => {                
                chnl = rows[0].reports;
                resolve(chnl);
            })
        })
    },

    getautoapproved: function(member, con) {
        var bolean;
        return new Promise(function(resolve, reject) {
            con.query(`SELECT * FROM servers WHERE id = '${member.guild.id}'`, (err, rows) => {
                bolean = rows[0].auto_approved;
                resolve(bolean);
            })
        })
    },

    getservergreeting: function (member, con) {
        var msg
        return new Promise(function (resolve, reject) {
            con.query(`SELECT * FROM servers WHERE id = '${member.guild.id}'`, (err, rows) => {
                msg = rows[0].server_greeting;
                resolve(msg);
            })
        })
    }

    
};