const { Client, Collection } = require('discord.js');

module.exports = class extends Client {
    constructor(config) {
        super({});

        this.queue = new Map();

        this.config = config;
    }
};