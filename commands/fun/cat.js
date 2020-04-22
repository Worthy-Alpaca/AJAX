const fetch = require('node-fetch');
fetch('https://aws.random.cat/meow').then(response => response.json());



module.exports = {
  name: "cat",
  category: "fun",
  description: "Sends a random cat",
  run: async (client, message, args) => {
    if (message.deletable) message.delete();

    const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());

	message.channel.send(file);
  }
 }