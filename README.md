# AJAX

[![node](https://img.shields.io/badge/Node.js-v.12.X-brightgreen)](https://nodejs.org)
[![Discord](https://img.shields.io/badge/Discord-v.12-blue)](https://discord.js.org/#/docs/main/stable/general/welcome)
[![MySQL](https://img.shields.io/badge/MySQL-v.8.0-9cf)](https://www.mysql.com/)
![requirements](https://img.shields.io/badge/requirements-up%20to%20date-brightgreen)

AJAX is a discord moderation bot that also has an EDSM API connection so you can use it for Elite: Dangerous servers.

> As this project is under heavy development, I cannot offer support at this time.  However, please do report bugs or issues on my little project [here.](https://github.com/Worthy-Alpaca/AJAX/issues)

You can add AJAX to your server [here.](https://discord.com/api/oauth2/authorize?client_id=682255208125956128&permissions=8&redirect_uri=https%3A%2F%2Fworthyalpaca.de%2F&scope=bot)

## What I can do

- Moderation 
- Information
- Fun

> check out my commands [here.](commands)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and also on a deployment server.

## Stuff you'll need
* Node.js version 12 or higher
* Node Package Manager
* Discord.js version 12 
* MySQL version 8.0 or higher

### How to install

* First you need to install Node.js

    - For linux systems: 
    ```
    sudo apt-get install nodejs
    ```
    * Download for Windows systems [here](https://nodejs.org/en/download/)

- Then you need to install the Node Package Manager (only on linux)
```
sudo apt-get install npm
```

- Then install Discord.js

    * Run this in your console
    ```
    npm install discord.js
    ```

- Now clone the repository
```
git clone https://github.com/Worthy-Alpaca/AJAX.git
```

- Now install the dependencies from package.json
```
npm install
```

- Next you need to install MySQL 

    - For linux systems follow [this](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-18-04) guide if you're unsure otherwise just do this
    ```
    sudo apt update
    sudo apt install mysql-server
    sudo mysql_secure_installation
    ```
    - For Windows you can download it [here](https://dev.mysql.com/downloads/windows/installer/8.0.html)

- Set up your database and make sure to name it 'discord'
    - if you wish to use another database you'll have to change it in /src/config.json

- Lastly you need to put both your Discord Bot token and your SQL password into the included token file and rename it to token.json

Thats it


