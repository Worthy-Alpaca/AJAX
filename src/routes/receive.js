const router = require('express').Router();
// import client
const client = require('../client');

const functions = require('../../functions/functions');
const defFunctions = require('../../functions/default_functions');


router.get('/', async (req, res) => {
    const guild = client.guilds.cache.get(req.query.guildID);
    defFunctions.gather_server_channels(guild, functions.post_API_call);
    defFunctions.gather_server_roles(guild, functions.post_API_call);
    
})

module.exports = router;