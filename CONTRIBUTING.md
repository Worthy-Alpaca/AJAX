# Contributing

You want to contribute to the project? Amazing!

## Things to know

By contributing to this repository, you are expected to know and follow the rules of general conduct outlined in the [Code of Conduct.](https://github.com/Worthy-Alpaca/AJAX/blob/master/CODE_OF_CONDUCT.md#contributor-covenant-code-of-conduct)

**Working on your first Pull Request?** [How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

## How to

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

- Now clone the repository
```
git clone https://github.com/Worthy-Alpaca/AJAX.git
```

- Now install the dependencies from package.json
```
npm install
```

- Next you need the API behing AJAX. *Since version 4.0.0 it handles all access to the database.*

    - You can get it [here.](https://github.com/Worthy-Alpaca/api.ajax-discord.com)


- Lastly you need to put some things into the included env file and rename it to .env
    - Your discord Token
    - The API address
    - The API token secret

Thats it
