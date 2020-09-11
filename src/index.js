const { Client, Collection } = require("discord.js");
const { version, status, DIFF, LIMIT, TIME, database, owner } = require('./config.json');
var { prefix } = require('./config.json');
const { token, password, API_ADDRESS, TOKEN_SECRET } = require('../token.json');
const fetch = require('node-fetch');
const fs = require("fs");
const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
const { getChnl, getAdmin, getMsg, getapproved, getapproved2, getservergreeting, getstartcmd, getreportschannel, getautoapproved, getprefix } = require("../functions/db_queries.js");
const usersMap = new Map();
const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const { bugs } = require("../package.json");
const { password_generator, gather_channels, gather_roles, get_API_call, post_API_call, delete_API_call, update_API_call } = require('../functions/functions.js');

const client = new Client({
  disableEveryone: false
});

client.reply = new Collection();
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");

["command"].forEach(handler => {
  require(`../handler/${handler}`)(client);
});

//creating the database connection
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: password,
  database: database,
  charset: "utf8mb4",
  encoding: "utf8mb4_unicode_520_ci",
  acquireTimeout: 1000000
});

con.connect(err => {
  if (err) throw err;
  console.log("Connected to Database");
  con.query("CREATE TABLE IF NOT EXISTS servers(id VARCHAR(20) NOT NULL UNIQUE, name TEXT NOT NULL, admin TEXT, moderator TEXT, greeting VARCHAR(512), channel TEXT, approved TEXT, startcmd TEXT, reports TEXT, auto_approved TEXT, server_greeting TEXT, prefix TEXT) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;")
  con.query("CREATE TABLE IF NOT EXISTS ranks(rank_id VARCHAR(20) NOT NULL UNIQUE, server_id VARCHAR(20) NOT NULL, rank_name TEXT NOT NULL);")
  con.query("CREATE TABLE IF NOT EXISTS login(server_id VARCHAR(255) NOT NULL UNIQUE, password TEXT NOT NULL);");
  con.query("CREATE TABLE IF NOT EXISTS channels(server_id VARCHAR(255) NOT NULL, channel_id VARCHAR(255) NOT NULL UNIQUE, channel_name TEXT NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;");
  con.query("CREATE TABLE IF NOT EXISTS roles(server_id VARCHAR(255) NOT NULL, role_id VARCHAR(255) NOT NULL UNIQUE, role_name TEXT NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;");
})

client.on("ready", () => {
  var a = 0;
  console.log(`Logged in as ${client.user.username}`);

  client.users.fetch(owner, false).then(user => {
    user.send(`I restarted`)
  });

  /* client.guilds.cache.forEach(guild => {

    con.query(`SELECT * FROM servers WHERE id = '${guild.id}'`, (err, rows) => {
      if (err) throw err;
      let sql;

      if (!rows.length) {
        console.log(guild.name, "added")
        sql = `INSERT INTO servers (id, name) VALUES ('${guild.id}', "${guild.name}")`
        return con.query(sql);
      }

      if (rows[0].id === guild.id) {
        a++;
        return;
      } else {
        console.log("b")
        sql = `INSERT INTO servers (id, name) VALUES ('${guild.id}', "${guild.name}")`
        con.query(sql);
      }

    });
  }) */

  if (a > 0) console.log("No new servers")

  client.user.setPresence({
    status: "online",
    activity: {
      name: `${status}`,
      type: "LISTENING"
    }
  });
});

//handling channel additions and deletions
client.on("channelDelete", async channel => {

  const payload = JSON.stringify({
    'channel': channel,
    'guild': channel.guild
  })

  return delete_API_call('channel/delete', payload, channel, 'channel');  
})

client.on('channelCreate', async channel => {
  if (channel.type === 'dm') {
    return;
  }
  
  const payload = JSON.stringify({
    'channel': channel,
    'guild': channel.guild
  })

  return post_API_call('channel/create', payload, channel, 'channel');  

})
client.on('channelUpdate', async function(oldChannel, newChannel) {
  
  /* con.query(`SELECT * FROM channels WHERE server_id = '${newChannel.guild.id}' AND channel_id = '${newChannel.id}'`, (err, rows) => {
    if (err) throw err;
    let sql;

    if (rows.length === 1) {
      if (rows[0].channel_name !== newChannel.name) {
        console.log(oldChannel.name, "updated to", newChannel.name)
        sql = `UPDATE channels SET channel_name = '${newChannel.name}' WHERE channel_id = '${newChannel.id}'`
        return con.query(sql);
      } else {
        return;
      }
    } else return;

  }); */

  const payload = JSON.stringify({
    'channel': newChannel,
    'guild': newChannel.guild
  })

  return update_API_call('channel/update', payload, newChannel, 'channel'); 
})

//handling role additions, updates and deletions
client.on('roleCreate', async role => {
  //console.log(role.id, "updated", role.name)
  con.query(`SELECT * FROM roles WHERE server_id = '${role.guild.id}' AND role_id = '${role.id}'`, (err, rows) => {
    if (err) throw err;
    let sql;

    if (!rows.length) {
      console.log(role.name, "added")
      sql = `INSERT INTO roles (server_id, role_id, role_name) VALUES ('${role.guild.id}', "${role.id}", "${role.name}")`
      return con.query(sql);
    }

  });
})

client.on('roleUpdate', async function(oldRole, newRole) {

  con.query(`SELECT * FROM roles WHERE server_id = '${newRole.guild.id}' AND role_id = '${newRole.id}'`, (err, rows) => {
    if (err) throw err;
    let sql;

    if (rows.length === 1) {
      if (rows[0].role_name !== newRole.name) {
        console.log(oldRole.name, "updated to", newRole.name)
        sql = `UPDATE roles SET role_name = '${newRole.name}' WHERE role_id = '${newRole.id}'`
        return con.query(sql);
      } else {
        return;
      }
    } else {
      return;
    }

  })

})

client.on('roleDelete', async role => {
  console.log(role.name, 'deleted')
  con.query(`SELECT * FROM roles WHERE role_name = '${role.name}' AND role_id = '${role.id}'`, (err, rows) => {
    if (rows.length === 1) {
      let sql = `DELETE FROM roles WHERE role_name = '${role.name}' AND role_id = '${role.id}'`
      con.query(sql);
    } else {
      console.log("something is wrong here")
    }
  });
})

//on joining a new server
client.on("guildCreate", async guild => {

  client.users.fetch(owner, false).then(user => {
    user.send(`I was added to a new server: ${guild.name}, ${guild.id}`)
  });

  let password = password_generator(8);
  let username = guild.id;
  const token = jwt.sign({ _id: username }, TOKEN_SECRET);

  /* con.query(`SELECT * FROM login WHERE server_id = '${username}'`, async (err, rows) => {
    if (!rows.length) {
      try {
        await fetch(API_ADDRESS + '/user/register', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'content-type': 'application/json',
            'auth-token': token
          },
          body: JSON.stringify({
            username: username,
            password: password
          })
        }).then(res => {
          console.log(res)
          if (res.status === 200) {
            console.log("successfully registered")
          }
        })
      } catch {
        client.users.fetch(owner, false).then(user => {
          return user.send(`There has been an error. ${guild.id}, ${guild.name} already exists in the database and caused an issue.`)
        });
      }
    } else {
      client.users.fetch(owner, false).then(user => {
        user.send(`There has been an error. ${guild.id}, ${guild.name} already exists in the database and caused an issue.`)
      });
    }
  }) */

  await fetch(API_ADDRESS + '/user/register', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'content-type': 'application/json',
      'auth-token': token
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  }).then(res => {
    console.log(res)
    if (res.status === 200) {
      console.log("successfully registered")
    }
  })

  guild.channels.create('bot-setup');

  const embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setTimestamp()
    .setFooter(`Version: ${version}`)
    .setThumbnail(client.user.displayAvatarURL())
    .setDescription(stripIndents`**Hello there I'm ${client.user.username}**`)
    .addField(`\u200b`, stripIndents`Thank you for inviting me to your server.
    I have created #bot-setup for you to run **!setserver** in. That will set everything up.
    See [!help](https://ajax-discord.com/commands) for all of my commands. Enjoy :grin:
    You can also log into the [dashboard](https://ajax-discord.com/login).
    Username: \`${username}\`
    Password: \`${password}\``)
    .addField(`\u200b`, stripIndents`If you have any issues please report them [here.](${bugs.url})`);

  client.users.fetch(guild.owner.id, false).then(user => {
    user.send(embed);
  })



  con.query(`SELECT * FROM servers WHERE id = '${guild.id}'`, (err, rows) => {
    if (err) throw err;
    let sql;
    let db;

    if (!rows.length) {
      console.log(guild.name, "added")
      sql = `INSERT INTO servers (id, name) VALUES ('${guild.id}', "${guild.name}")`
      return con.query(sql);
    }

    if (rows[0].id === guild.id) {
      db = true;

      return;
    } else {
      console.log("b")
      sql = `INSERT INTO servers (id, name) VALUES ('${guild.id}', "${guild.name}")`
      db = true;

      con.query(sql);
    }

  });
})

client.on("guildDelete", guild => {
  client.users.fetch(owner, false).then(user => {
    user.send(`I was kicked from ${guild.name}, ${guild.id}`)
  });

  con.query(`SELECT * FROM servers WHERE id = '${guild.id}'`, (err, rows) => {

    let sql = `DELETE FROM servers WHERE id = '${guild.id}'`
    con.query(sql);
  })

  con.query(`SELECT * FROM login WHERE server_id = '${guild.id}'`, (err, rows) => {
    let sql = `DELETE FROM login WHERE server_id = '${guild.id}'`
    con.query(sql);
  })
})

//welcome message
client.on("guildMemberAdd", async member => {
  var greeting;

  if (member.bot) return;
  const api = await get_API_call(message, "getserver");

  //greeting = await getMsg(member, con);
  //bolean = await getautoapproved(member, con);
  greeting = api.greeting; //#########################
  bolean = api.auto_approved; //###############################
  //rl = await getapproved(member, con);
  //chnl = await getChnl(member, con);
  const role = member.guild.roles.cache.find(r => r.id === api.approved); //#######################
  //var msg = await getservergreeting(member, con);
  var msg = api.server_greeting; //#############################
  var channel = member.guild.channels.cache.find(channel => channel.id === api.channel); //##############################

  if (typeof greeting == 'undefined' || greeting === null) {
    greeting = "Welcome to this generic server. The owner has not bothered with a custom welcome message so you get this one. :person_shrugging:"
  } 

  if (typeof channel == 'undefined' || channel === null) {
    channel = member.guild.channels.cache.find(channel => channel.id === member.guild.systemChannelID);
  }

  if (bolean === "true") {
    member.roles.add(role.id).catch(e => console.log(e.message));
    if (msg === null) {
      msg = "welcome to this generic server :grin:"
    }

    const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTimestamp()
      .setAuthor(`${member.displayName}, ${msg}`, member.user.displayAvatarURL());

    client.users.fetch(member.id, false).then(user => {
      user.send(`Welcome to **${member.guild.name}**. ${greeting}`)
    })

    return channel.send(embed);
  }

  client.users.fetch(member.id, false).then(user => {
    return user.send(`Welcome to **${member.guild.name}**. ${greeting}`)
  })



});

//message handler
client.on("message", async message => {
  if (message.author.bot) return;

  const api = await get_API_call(message, "getserver");
  //console.log(api)

  if (message.guild === null) {
    return message.reply("Hey there, no reason to DM me anything. I won't answer anyway :wink:");
  }

  //const custom_prefix = await getprefix(message, con).catch(err => console.log(err));
  const custom_prefix = api.prefix;

  if (custom_prefix !== null) {
    prefix = custom_prefix;
  }

  //automated spam detection and mute
  if (usersMap.has(message.author.id)) {
    let mutee = message.member;
    //const reports = await getreportschannel(message, con);
    //const adm = await getAdmin(message, con);    
    const admin = message.guild.roles.cache.find(r => r.id === api.admin); //###########################
    const report = message.guild.channels.cache.find(channel => channel.id === api.reports); //###########################
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
          await channel.overwritePermissions([
            {
              id: muterole.id,
              deny: ['SEND_MESSAGES',
                'ADD_REACTIONS',
                'SEND_TTS_MESSAGES',
                'ATTACH_FILES',
                'SPEAK']
            }
          ])
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
        /* setTimeout(() => {
          mutee.removeRole(muterole);
          message.channel.send('You have been unmuted');
        }, TIME); */
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
  //const startcommand = await getstartcmd(message, con);

  if (message.content.startsWith(`${api.startcmd}`)) { //######################
    message.delete();
    var chnl;
    var rl;

    const member = message.member;
    guild = member.guild;
    //rl = await getapproved2(message, con);
    //chnl = await getChnl(member, con);
    //var msg = await getservergreeting(member, con);

    const role = message.guild.roles.cache.find(r => r.id === api.approved); //###########################
    var channel = member.guild.channels.cache.find(channel => channel.id === api.channel); //###########################

    if (typeof channel == 'undefined') {
      channel = member.guild.channels.cache.find(channel => channel.id === member.guild.systemChannelID);
    } else if (channel === null) {
      channel = member.guild.channels.cache.find(channel => channel.id === member.guild.systemChannelID);
    }

    if (message.member.roles.cache.has(role.id)) {
      return
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

  if (message.mentions.has(client.user)) {
    if (message.content.toLowerCase().includes("help") || message.content.toLowerCase().includes("prefix")) {
      return message.reply(`My prefix for this server is \`${prefix}\`. You can use \`${prefix}help\` to get all the commands available to you.`)
    }
    if (message.content.toLowerCase().includes("version")) {
      return message.reply(`Current version is \`${version}\``)
    }
  }

  //command parser
  if (!message.content.startsWith(prefix)) return;

  if (!message.member) message.member = await message.guild.fetchMember(message);

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));

  if (command) command.run(client, message, args, con, api);
})

//Handling API errors
process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
})

client.login(token);