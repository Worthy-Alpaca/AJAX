//######################################################################################################################
// All of these functions are deprecated as of version 4.0.0 and not in use anymore
// They have been replaced with a REST API that will handle database queries 
// They requiere an active connection to a MySQL database
//######################################################################################################################

module.exports = {
	/**
    * @description deprecated DO NOT USE!
    */
	getAdmin: function(message) {
		var admininstrator;  
        
		return new Promise(function(resolve, reject) {
			con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
				admininstrator = rows[0].admin;
				resolve(admininstrator);              
			}); 
		});            
	},
	/**
    * @description deprecated DO NOT USE!
    */
	getMod: function(message) {
		var moderator;  
        
		return new Promise(function(resolve, reject) {
			con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
				moderator = rows[0].moderator;
				resolve(moderator);              
			}); 
		});            
	},
	/**
    * @description deprecated DO NOT USE!
    */
	getChnl: function(member) {
		var channel;  
        
		return new Promise(function(resolve, reject) {
			con.query(`SELECT * FROM servers WHERE id = '${member.guild.id}'`, (err, rows) => {
				channel = rows[0].channel;
				resolve(channel);              
			}); 
		}); 
	},
	/**
    * @description deprecated DO NOT USE!
    */
	getMsg: function(member) {
		var msg;

		return new Promise(function(resolve, reject) {
			con.query(`SELECT * FROM servers WHERE id = '${member.guild.id}'`, (err, rows) => {
				msg = rows[0].greeting;
				resolve(msg);
			});
		});
	},
	/**
    * @description deprecated DO NOT USE!
    */
	getapproved: function(member) {
		var msg;

		return new Promise(function(resolve, reject) {
			con.query(`SELECT * FROM servers WHERE id = '${member.guild.id}'`, (err, rows) => {
				msg = rows[0].approved;
				resolve(msg);
			});
		});
	},
	/**
    * @description deprecated DO NOT USE!
    */
	getapproved2: function(message) {
		var msg;

		return new Promise(function(resolve, reject) {
			con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
				msg = rows[0].approved;
				resolve(msg);
			});
		});
	},
	/**
    * @description deprecated DO NOT USE!
    */
	getstartcmd: function(message) {
		var msg;

		return new Promise(function(resolve, reject) {
			con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
				msg = rows[0].startcmd;
				resolve(msg);
			});
		});
	},
	/**
    * @description deprecated DO NOT USE!
    */
	getreportschannel: function(message) {
		var chnl;
		return new Promise(function(resolve, reject) {
			con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {                
				chnl = rows[0].reports;
				resolve(chnl);
			});
		});
	},
	/**
    * @description deprecated DO NOT USE!
    */
	getinfractions: function(tblid, rMember) {
		var infractions;
		return new Promise(function(resolve, reject) {
			con.query(`SELECT * FROM ${tblid.join('')} WHERE member_id = '${rMember.id}'`, (err, rows) => {
				if (err) throw err;
				if (rows.length < 1) {                    
					infractions = 0;
					resolve(infractions);
				} else if (rows[0].member_id === rMember.id) {                    
					infractions = rows[0].infractions;
					resolve(infractions);   
				}
                
			});
		});
	},
	/**
    * @description deprecated DO NOT USE!
    */
	getranks: function(message) {
		var ranks = [];
		return new Promise(function(resolve, reject) {
			con.query(`SELECT * FROM ranks WHERE server_id = '${message.guild.id}'`, (err, rows) => {
				if (rows.length < 1) {
					name = 'No ranks on this server yet. Do you have suggestions for ranks? Contact the admin nearest to you.';
					ranks.push(name);
					resolve(ranks);
				} else {
					a = 0;
					while(a !== rows.length) {
						name = rows[a].rank_name;
						ranks.push(name); 
						a++;
					}                   
                    
					resolve(ranks);
				}
			});
		});
	},
	/**
    * @description deprecated DO NOT USE!
    */
	getrank: function(message, rank) {
		var r;
		return new Promise(function(resolve, reject) {
			con.query(`SELECT * FROM ranks WHERE server_id = '${message.guild.id}' AND rank_id = '${rank.id}'`, (err, rows) => {
				if (rows[0].rank_id === rank.id) {
					r = true;
					resolve(r);
				} else {
					r = false;
					resolve(r);
				}
			});
		});
	},
	/**
    * @description deprecated DO NOT USE!
    */
	setrank: function(message, rank) {
		let sql;
		var success;
		return new Promise(function(resolve, reject) {
			con.query(`SELECT * FROM ranks WHERE server_id = '${message.guild.id}' AND rank_id = '${rank.id}'`, (err, rows) => {
				if (rows.length < 1) {
					sql = `INSERT INTO ranks (rank_id, server_id, rank_name) VALUES ('${rank.id}','${message.guild.id}', '${rank.name}')`;
					success = true;
					resolve(success);
					return con.query(sql);
				} else {
					success = false;
					return resolve(success);
				}
			});
		});
	},
	/**
    * @description deprecated DO NOT USE!
    */
	delrank: function(message, rank) {
		let sql;
		var success;
		if  (typeof rank.id != 'undefined') {            
			return new Promise(function (resolve, reject) {
				con.query(`SELECT * FROM ranks WHERE server_id = '${message.guild.id}' AND rank_id = '${rank.id}'`, (err, rows) => {
					if (rows.length < 1) {
						success = false;
						return resolve(success);
					} else {
						sql = `DELETE FROM ranks WHERE server_id = '${message.guild.id}' AND rank_id = '${rank.id}'`;
						success = true;
						resolve(success);
						return con.query(sql);
					}
				});
			});
		} else {
			return new Promise(function (resolve, reject) {
				con.query(`SELECT * FROM ranks WHERE server_id = '${message.guild.id}' AND rank_name = '${rank}'`, (err, rows) => {
					if (rows.length < 1) {
						success = false;
						return resolve(success);
					} else {
						sql = `DELETE FROM ranks WHERE server_id = '${message.guild.id}' AND rank_name = '${rank}'`;
						success = true;
						resolve(success);
						return con.query(sql);
					}
				});
			});
		}
        
	},
	/**
    * @description deprecated DO NOT USE!
    */
	getservers: function(message) {
		var servers = [];
		return new Promise(function(resolve, reject) {
			con.query('SELECT * FROM servers', (err, rows) => {
				if (rows.length < 1) {
					name = 'I\'m not deployed on any servers :frowning2:';
					ranks.push(name);
					resolve(ranks);
				} else {
					a = 0;
					while(a !== rows.length) {
						name = rows[a].id;
						servers.push(name); 
						a++;
					}                   
                    
					resolve(servers);
				}
			});
		});
	},
	/**
    * @description deprecated DO NOT USE!
    */
	getserverchannel: function(srv) {
		var chnl;
		return new Promise(function(resolve, reject) {
			con.query(`SELECT * FROM servers WHERE id = '${srv.id}'`, (err, rows) => {                
				chnl = rows[0].reports;
				resolve(chnl);
			});
		});
	},
	/**
    * @description deprecated DO NOT USE!
    */
	getautoapproved: function(member) {
		var bolean;
		return new Promise(function(resolve, reject) {
			con.query(`SELECT * FROM servers WHERE id = '${member.guild.id}'`, (err, rows) => {
				bolean = rows[0].auto_approved;
				resolve(bolean);
			});
		});
	},
	/**
    * @description deprecated DO NOT USE!
    */
	getservergreeting: function (member) {
		var msg;
		return new Promise(function (resolve, reject) {
			con.query(`SELECT * FROM servers WHERE id = '${member.guild.id}'`, (err, rows) => {
				msg = rows[0].server_greeting;
				resolve(msg);
			});
		});
	},
	/**
    * @description deprecated DO NOT USE!
    */
	getprefix: function (message) {
		var prefix;
		return new Promise(function (resolve, reject) {
			con.query(`SELECT * FROM servers WHERE id = '${message.guild.id}'`, (err, rows) => {
				prefix = rows[0].prefix;
				resolve(prefix);
			});
		});
	},
	/**
    * @description deprecated DO NOT USE!
    */
	addreddit: function (message, reddit) {
		var sql;
		var success;
		return new Promise(function (resolve, reject) {
			con.query(`SELECT * FROM reddits WHERE server_id = '${message.guild.id}' AND reddit = '${reddit}'`, (err, rows) => {
				if (rows.length < 1) {
					sql = `INSERT INTO reddits (server_id, reddit) VALUES ('${message.guild.id}', '${reddit}')`;
					success = true;
					resolve(success);
					return con.query(sql);
				} else {
					success = false;
					return resolve(success);
				}
			});
		});
	},
	/**
    * @description deprecated DO NOT USE!
    */
	getreddits: function (message) {
		var reddits = [];
		return new Promise(function (resolve, reject) {
			con.query(`SELECT * FROM reddits WHERE server_id = '${message.guild.id}'`, (err, rows) => {
				if (rows.length < 1) {
					reddit_none = false;
					resolve(reddit_none);
				} else {
					a = 0;
					while (a !== rows.length) {
						name = rows[a].reddit;
						reddits.push(name);
						a++;
					}

					resolve(reddits);
				}
			});
		});
	},
	/**
    * @description deprecated DO NOT USE!
    */
	delreddit: function (message, reddit) {
		return new Promise(function (resolve, reject) {
			con.query(`SELECT * FROM reddits WHERE server_id = '${message.guild.id}' AND reddit = '${reddit}'`, (err, rows) => {
				if (rows.length < 1) {
					success = false;
					return resolve(success);
				} else {
					sql = `DELETE FROM reddits WHERE server_id = '${message.guild.id}' AND reddit = '${reddit}'`;
					success = true;
					resolve(success);
					return con.query(sql);
				}
			});
		});
	}
};