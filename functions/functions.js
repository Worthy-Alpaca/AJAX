const fetch = require('node-fetch');
const { API_ADDRESS, TOKEN_SECRET } = require('../token.json');
const jwt = require('jsonwebtoken');

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
        
        time *= 1000;
 
        for (const reaction of validReactions) await message.react(reaction);

        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

        return message
            .awaitReactions(filter, { max: 1, time: time})
            .then(collected => collected.first() && collected.first().emoji.name);
    },

    filter_integer: function (message, mention) {
        return new Promise(function (resolve, reject) {
            var person = Array.from(mention)
            if (person.includes("@") || person.includes("#")) {                
                var mbr = []
                person.forEach(function(letter) {
                    if (Number.isInteger(+letter)) {
                        mbr.push(letter)
                    }                    
                })
                return resolve(mbr.join(""))
            } else {
                var mbr2 = message.guild.roles.cache.find(r => r.name === person.join(""));
                if (!mbr2) {
                    mbr2 = message.guild.channels.cache.find(r => r.name === person.join(""));
                }
                return resolve(mbr2.id);
            }
        })
    },

    pageparser: function (message, msg, i, time, chooseArr, promptMessage, array_length) {
        
        return new Promise(async function (resolve, reject) {
            const chooseArrfirst = [chooseArr[1], chooseArr[2]]
            const chooseArrlast = [chooseArr[0], chooseArr[1]]
            if (i === 0) {
                var reaction = await promptMessage(msg, message.author, time, chooseArrfirst);

                if (reaction === chooseArr[2]) {
                    msg.delete();  
                    i++;                    
                    return resolve(i);
                } else if (reaction === chooseArr[1]) {
                    i = array_length + 1;
                    msg.delete();
                    return;
                }
            } else if (i === array_length - 1) {
                var reaction = await promptMessage(msg, message.author, time, chooseArrlast);

                if (reaction === chooseArr[0]) {
                    msg.delete();
                    i--;                    
                    return resolve(i);                  
                } else if (reaction === chooseArr[1]) {
                    i = array_length + 1;
                    msg.delete();
                    return;
                }
            } else {
                var reaction = await promptMessage(msg, message.author, time, chooseArr);

                if (reaction === chooseArr[0]) {
                    msg.delete();
                    i--;                    
                    return resolve(i);                    
                } else if (reaction === chooseArr[2]) {
                    msg.delete();
                    i++;                    
                    return resolve(i);
                } else if (reaction === chooseArr[1]) {
                    i = array_length + 1;
                    msg.delete();
                    return;
                }
            }
        })
    },

    password_generator: function(len) {
        var length = (len) ? (len) : (10);
        var string = "abcdefghijklmnopqrstuvwxyz"; //to upper 
        var numeric = '0123456789';
        var punctuation = '!@#$%^&*()_+~`|}{[]\:;?><,./-=';
        var password = "";
        var character = "";
        var crunch = true;
        while (password.length < length) {
            entity1 = Math.ceil(string.length * Math.random() * Math.random());
            entity2 = Math.ceil(numeric.length * Math.random() * Math.random());
            entity3 = Math.ceil(punctuation.length * Math.random() * Math.random());
            hold = string.charAt(entity1);
            hold = (password.length % 2 == 0) ? (hold.toUpperCase()) : (hold);
            character += hold;
            character += numeric.charAt(entity2);
            character += punctuation.charAt(entity3);
            password = character;
        }
        password = password.split('').sort(function () { return 0.5 - Math.random() }).join('');
        return password.substr(0, len);
    },

    gather_channels: function (client, con) {
        client.guilds.cache.forEach(server => {
            server.channels.cache.forEach(channel => {

                con.query(`SELECT * FROM channels WHERE server_id = '${server.id}' AND channel_id = '${channel.id}'`, (err, rows) => {
                    if (err) throw err;
                    let sql;

                    if (!rows.length) {
                        console.log(channel.name, "added")
                        sql = `INSERT INTO channels (server_id, channel_id, channel_name) VALUES ('${server.id}', "${channel.id}", "${channel.name}")`
                        return con.query(sql);
                    } else if (rows.length === 1) {
                        if (rows[0].channel_name !== channel.name) {
                            console.log(channel.name, "updated to")
                            sql = `UPDATE channels SET channel_name = '${channel.name}' WHERE channel_id = '${channel.id}'`
                            return con.query(sql);
                        } else {
                            return;
                        }
                    }

                });
            })
        })
    },

    gather_roles: function (client, con) {
        client.guilds.cache.forEach(server => {
            server.roles.cache.forEach(role => {

                con.query(`SELECT * FROM roles WHERE server_id = '${role.guild.id}' AND role_id = '${role.id}'`, (err, rows) => {
                    if (err) throw err;
                    let sql;

                    if (!rows.length) {
                        console.log(role.name, "added")
                        sql = `INSERT INTO roles (server_id, role_id, role_name) VALUES ('${role.guild.id}', "${role.id}", "${role.name}")`
                        return con.query(sql);
                    } else if (rows.length === 1) {
                        if (rows[0].role_name !== role.name) {
                            console.log(role.name, "updated")
                            sql = `UPDATE roles SET role_name = '${role.name}' WHERE role_id = '${role.id}'`
                            return con.query(sql);
                        } else {
                            return;
                        }
                    }

                });
            })
        })
    },

    get_API_call: function (message, api_section = '', type = '') {
        return new Promise(async function (resolve, reject) {
            const token = jwt.sign({ _id: message.guild.id }, TOKEN_SECRET);
            //console.log(token)
            const response = await fetch(API_ADDRESS + `/discord/${api_section}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'content-type': 'application/json',
                    'auth-token': token,
                    'server_id': message.guild.id,
                    'type': type
                }                
            }).then(function (response) {
                return response.json();
            })

            return resolve(response);
        })
    },

    post_API_call: function (api_section = '', payload, guild, type = '') {
        return new Promise(async function (resolve, reject) {
            const token = jwt.sign({ _id: guild.id }, TOKEN_SECRET);
            //console.log(token)
            const response = await fetch(API_ADDRESS + `/discord/${api_section}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'content-type': 'application/json',
                    'auth-token': token,
                    'type': type,
                },
                body: payload
            }).then(function (response) {
                return response.json();
            })

            return resolve(response);
        })
    },

    delete_API_call: function (api_section = '', payload, guild, type = '') {
        return new Promise(async function (resolve, reject) {
            const token = jwt.sign({ _id: guild.id }, TOKEN_SECRET);
            //console.log(token)
            const response = await fetch(API_ADDRESS + `/discord/${api_section}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'content-type': 'application/json',
                    'auth-token': token,
                    'type': type,
                },
                body: payload
            }).then(function (response) {
                return response.json();
            })

            return resolve(response);
        })
    },

    update_API_call: function (api_section = '', payload, guild, type = '') {
        return new Promise(async function (resolve, reject) {
            const token = jwt.sign({ _id: guild.id }, TOKEN_SECRET);
            //console.log(token)
            const response = await fetch(API_ADDRESS + `/discord/${api_section}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'content-type': 'application/json',
                    'auth-token': token,
                    'type': type,
                },
                body: payload
            }).then(function (response) {
                return response.json();
            })

            return resolve(response);
        })
    }
        
};