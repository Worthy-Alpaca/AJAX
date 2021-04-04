const { Client } = require('discord.js');

module.exports = class extends Client {
	constructor(config) {
		super({});

		this.queue = new Map();
		this.polls = new Map();
		this.counts = new Map();

		this.config = config;
	}
};