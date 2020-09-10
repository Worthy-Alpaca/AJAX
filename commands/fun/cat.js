const fetch = require('node-fetch');

module.exports = {
  name: "cat",
  category: "fun",
  permission: ["none", "moderator", "admin"],
  description: "Sends a random cat",
  descriptionlong: "Sends a random cat",
  run: async (client, message, args, con) => {
    if (message.deletable) message.delete();

    const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());

    message.channel.send(file);
  }
}