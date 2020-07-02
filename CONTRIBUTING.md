# Contributing

You want to contribute to the project? Amazing!

## Things to know

By contributing to this repository, you are expected to know and follow the rules of general conduct outlined in the [Code of Conduct.](https://github.com/Worthy-Alpaca/AJAX/blob/master/CODE_OF_CONDUCT.md#contributor-covenant-code-of-conduct)

**Working on your first Pull Request?** [How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

## How to

* Project setup?
  [I've got you covered!](https://github.com/Worthy-Alpaca/AJAX#how-to-install)

* Found a bug?
  [Let me know!](https://github.com/Worthy-Alpaca/AJAX/issues/new?assignees=Worthy-Alpaca&labels=bug&template=bug_report.md&title=)

* Patched a bug?
  [Make a PR!](https://github.com/Worthy-Alpaca/AJAX/compare/)

* Adding a new feature?
  Please, *please*, ***please*** get some feedback from me. I don't want you to waste your time writing code on something that was struck down already.


### How to set everything up

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
