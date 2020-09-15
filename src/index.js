//Import Discord
const { Client, Collection } = require("discord.js");
const Discord = require("discord.js");

//Import FS
const fs = require("fs");

//Import constants and variables
const { version, status, DIFF, LIMIT, TIME, database, owner } = require('./config.json');
var { prefix } = require('./config.json');
const { token, password, API_ADDRESS, TOKEN_SECRET } = require('../token.json');
const { bugs } = require("../package.json");

//Import packages
const fetch = require('node-fetch');
const { stripIndents } = require("common-tags");
const jwt = require('jsonwebtoken');

//Import functions
const { password_generator, get_API_call, post_API_call, delete_API_call, update_API_call } = require('../functions/functions.js');

//Create new userMap
const usersMap = new Map();

//Import new Bot instance
const client = require('./client');

//Create command structures
client.reply = new Collection();
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");

//Assign the handler
["command"].forEach(handler => {
  require(`../handler/${handler}`)(client);
});

//Handling bot startup process
client.on("ready", async () => {
  var a = 0;
  console.log(`Logged in as ${client.user.username}`);
  message = {
    guild: {
      id: '111111111'
    }
  }
  const success = await get_API_call(message, 'check');
  if (success.success === true) {
    console.log("Connected to API");
  } else {
    console.log('NOT CONNECTED TO API!');
  }
  client.users.fetch(owner, false).then(user => {
    user.send(`I restarted`)
  });

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
client.on('channelCreate', channel => {
  if (channel.type === 'dm') {
    return;
  }
  
  const payload = JSON.stringify({
    'channel': channel,
    'guild': channel.guild
  })

  return post_API_call('channel/create', payload, channel.guild, 'channel');  

})

client.on('channelUpdate', function (oldChannel, newChannel) {

  const payload = JSON.stringify({
    'channel': newChannel,
    'guild': newChannel.guild
  })

  return update_API_call('channel/update', payload, newChannel.guild, 'channel'); 
})

client.on("channelDelete", channel => {

  const payload = JSON.stringify({
    'channel': channel,
    'guild': channel.guild
  })

  return delete_API_call('channel/delete', payload, channel.guild, 'channel');  
})

//handling role additions, updates and deletions
client.on('roleCreate', role => {

  const payload = JSON.stringify({
    'role': role,
    'guild': role.guild
  })

  return post_API_call('role/create', payload, role.guild, 'role'); 
})

client.on('roleUpdate', function(oldRole, newRole) {

  const payload = JSON.stringify({
    'role': newRole,
    'guild': newRole.guild
  })

  return update_API_call('role/update', payload, newRole.guild, 'role'); 
})

client.on('roleDelete', role => {

  const payload = JSON.stringify({
    'role': role,
    'guild': role.guild
  })

  return delete_API_call('role/delete', payload, role.guild, 'role');  
})

//on joining a new server
client.on("guildCreate", async guild => {

  client.users.fetch(owner, false).then(user => {
    user.send(`I was added to a new server: ${guild.name}, ${guild.id}`)
  });

  let password = password_generator(8);
  let username = guild.id;
  const token = jwt.sign({ _id: username }, TOKEN_SECRET);

  await fetch(API_ADDRESS + '/user/register', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'content-type': 'application/json',
      'auth-token': token
    },
    body: JSON.stringify({
      username: username,
      password: password,
      guild: {
        name: guild.name,
        id: guild.id
      }
    })
  }).then(res => {
    //console.log(res)
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

})

client.on("guildDelete", async guild => {
  client.users.fetch(owner, false).then(user => {
    user.send(`I was kicked from ${guild.name}, ${guild.id}`)
  });

  const payload = JSON.stringify({
    'guild': guild
  })

  const success = await delete_API_call('deleteserver', payload, guild, 'guild');

  if (success.success === false) {
    client.users.fetch(owner, false).then(user => {
      user.send(success.err);
    });
  } else {
    client.users.fetch(owner, false).then(user => {
      user.send(`Successfully deleted from database`)
    });
  }
})

//welcome message
client.on("guildMemberAdd", async member => {
  var greeting;

  if (member.bot) return;
  const api = await get_API_call(message, "getserver");

  //greeting = await getMsg(member);
  //bolean = await getautoapproved(member);
  greeting = api.greeting; //#########################
  bolean = api.auto_approved; //###############################
  //rl = await getapproved(member);
  //chnl = await getChnl(member);
  const role = member.guild.roles.cache.find(r => r.id === api.approved); //#######################
  //var msg = await getservergreeting(member);
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

  //console.log(api)

  if (message.guild === null) {
    return message.reply("Hey there, no reason to DM me anything. I won't answer anyway :wink:");
  }

  const api = await get_API_call(message, "getserver");
  
  const custom_prefix = api.prefix;

  if (custom_prefix !== null) {
    prefix = custom_prefix;
  }

  //automated spam detection and mute
  if (usersMap.has(message.author.id)) {
    let mutee = message.member;
    
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

  if (message.content.startsWith(`${api.startcmd}`)) { //######################
    message.delete();
    var chnl;
    var rl;

    const member = message.member;
    var msg = api.server_greeting;

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
  if (!command) return message.reply(`\`${api.prefix + cmd}\` doesn't exist!`);
  
  //Handling the permission check on a global level
  if (message.author.id === owner) {
    return command.run(client, message, args, api);
  } else if (command.permission.includes('none')) {
    return command.run(client, message, args, api);
  } else if (command.permission.includes('moderator')) {
    if (message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id === api.admin).id) || message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id === api.moderator).id) || message.member.hasPermission("ADMINISTRATOR")) {
      return command.run(client, message, args, api);
    } else {
      return message.reply(`You do not have the required permission to access \`${api.prefix + command.name}\``);
    }
  } else if (command.permission.includes('admin')) {
    if (message.member.roles.cache.has(message.guild.roles.cache.find(r => r.id === api.admin).id) || message.member.hasPermission("ADMINISTRATOR")) {
      return command.run(client, message, args, api);
    } else {
      return message.reply(`You do not have the required permission to access \`${api.prefix + command.name}\``);
    }
  } else {
    return message.reply(`\`${api.prefix + command.name}\` doesn't exist. Believe me, it really doesn't!`);
  }
   
})

//Handling API errors
process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
})

//Logging into discord
client.login(token);