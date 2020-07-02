const { Client, RichEmbed, Collection } = require("discord.js");
const { version, status, welcome_channel, DIFF, LIMIT, TIME, database } = require('./config.json');
var { prefix } = require('./config.json');
const { token, password } = require('../token.json');
const fs = require("fs");
const Discord = require("discord.js")
const { stripIndents } = require("common-tags");
const { getChnl, getMsg, getapproved, getapproved2, getservergreeting, getstartcmd, getreportschannel, getautoapproved, getprefix } = require("../functions/db_queries.js");
const usersMap = new Map();
const mysql = require("mysql");
const { bugs } = require("../package.json")


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
  encoding: "utf8mb4_unicode_ci"
});

con.connect(err => {
  if (err) throw err;
  console.log("Connected to Database");
  con.query("CREATE TABLE IF NOT EXISTS servers(id VARCHAR(20) NOT NULL UNIQUE, name TEXT NOT NULL, admin TEXT, moderator TEXT, greeting VARCHAR(512) CHARACTER SET utf8 COLLATE utf8_unicode_ci, channel TEXT, approved TEXT, startcmd TEXT, reports TEXT, auto_approved TEXT, server_greeting TEXT, prefix TEXT) CHARACTER SET utf8 COLLATE utf8_unicode_ci;")
  con.query("CREATE TABLE IF NOT EXISTS ranks(rank_id VARCHAR(20) NOT NULL UNIQUE, server_id VARCHAR(20) NOT NULL, rank_name TEXT NOT NULL);")
})

client.on("ready", () => {
  var a = 0;
  console.log(`Logged in as ${client.user.username}`);

  client.guilds.cache.forEach(guild => {

    con.query(`SELECT * FROM servers WHERE id = '${guild.id}'`, (err, rows) => {
      if (err) throw err;
      let sql;

      if (!rows.length) {
        console.log(guild.name, "added")
        sql = `INSERT INTO servers (id, name) VALUES ('${guild.id}', '${guild.name}')`
        return con.query(sql);
      }

      if (rows[0].id === guild.id) {
        a++;
        return;
      } else {
        console.log("b")
        sql = `INSERT INTO servers (id, name) VALUES ('${guild.id}', '${guild.name}')`
        con.query(sql);
      }

    });
  })

  if (a > 0) console.log("No new servers")

  client.user.setPresence({
    status: "online",
    activity: {
      name: `${status}`,
      type: "LISTENING"
    }
  });
});

//on joining a new server
client.on("guildCreate", guild => {

  client.users.fetch(`595341356432621573`, false).then(user => {
    user.send(`I was added to a new server: ${guild.name}, ${guild.id}`)
  });

  channel = guild.channels.cache.find(channel => channel.id === guild.systemChannelID);

  guild.channels.create('bot-setup');

  const embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setTimestamp()
    .setFooter(`Version: ${version}`)
    .setThumbnail(client.user.displayAvatarURL())
    .setDescription(stripIndents`**Hello there I'm ${client.user.username}**`)
    .addField(`\u200b`, stripIndents`I have created #bot-setup for you to run **!setserver** in order set everything up.
    See [!help](https://github.com/Worthy-Alpaca/AJAX/blob/develop/MY_COMMANDS.md) for all of my commands. Enjoy :grin:`)
    .addField(`\u200b`, stripIndents`If you have any issues please report them [here.](${bugs.url})`)

  //checking for systemmessage channel
  if (!channel) {
    client.users.fetch(message.guild.owner.id, false).then(user => {
      user.send(embed)
    })
  } else {
    channel.send(embed);
  }


  con.query(`SELECT * FROM servers WHERE id = '${guild.id}'`, (err, rows) => {
    if (err) throw err;
    let sql;
    let db;

    if (!rows.length) {
      console.log(guild.name, "added")
      sql = `INSERT INTO servers (id, name) VALUES ('${guild.id}', '${guild.name}')`
      return con.query(sql);
    }

    if (rows[0].id === guild.id) {
      db = true;

      return;
    } else {
      console.log("b")
      sql = `INSERT INTO servers (id, name) VALUES ('${guild.id}', '${guild.name}')`
      db = true;

      con.query(sql);
    }

  });
})

client.on("guildDelete", guild => {
  client.users.fetch(`595341356432621573`, false).then(user => {
    user.send(`I was kicked from ${guild.name}, ${guild.id}`)
  });

  con.query(`SELECT * FROM servers WHERE id = '${guild.id}'`, (err, rows) => {

    let sql = `DELETE FROM servers WHERE id = '${guild.id}'`
    con.query(sql);
  })
})


//welcome message
client.on("guildMemberAdd", async member => {
  var greeting;

  if (member.bot) return;

  greeting = await getMsg(member, con);
  bolean = await getautoapproved(member, con);
  rl = await getapproved(member, con);
  chnl = await getChnl(member, con);
  const role = member.guild.roles.cache.find(r => r.id === rl);
  var msg = await getservergreeting(member, con);
  var channel = member.guild.channels.cache.find(channel => channel.id === chnl);

  if (typeof greeting == 'undefined') {
    greeting = "Welcome to this generic server. The owner has not bothered with a custom welcome message so you get this one. :person_shrugging:"
  } else if (greeting === null) {
    greeting = "Welcome to this generic server. The owner has not bothered with a custom welcome message so you get this one. :person_shrugging:"
  }

  if (typeof channel == 'undefined') {
    channel = member.guild.channels.cache.find(channel => channel.id === member.guild.systemChannelID);
  } else if (channel === null) {
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

  const custom_prefix = await getprefix(message, con);

  if (custom_prefix !== null) {
    prefix = custom_prefix;
  }

  if (message.author.bot) return;


  //automated spam detection and mute
  if (usersMap.has(message.author.id)) {
    let mutee = message.member;
    const reports = await getreportschannel(message, con);
    const report = message.guild.channels.cache.find(channel => channel.id === reports);
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
        mutee.roles.add(muterole);
        message.channel.send(`${mutee} You have been muted. Please contact a staff member to get that reversed.`);
        report.send(`@here, someone has been auto-muted.`);
        report.send(embed);
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
  const startcommand = await getstartcmd(message, con);

  if (message.content.startsWith(`${startcommand}`)) {
    message.delete();
    var chnl;
    var rl;

    const member = message.member;
    guild = member.guild;
    rl = await getapproved2(message, con);
    chnl = await getChnl(member, con);
    var msg = await getservergreeting(member, con);

    const role = message.guild.roles.cache.find(r => r.id === rl);
    var channel = member.guild.channels.cache.find(channel => channel.id === chnl);

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

  //command parser
  if (!message.content.startsWith(prefix)) return;

  if (!message.member) message.member = await message.guild.fetchMember(message);

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));

  if (command)
    command.run(client, message, args, con);



})



client.login(token);


