# Drinklist
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![Docker](http://dockeri.co/image/kienhoefr/drinklist)](https://hub.docker.com/r/kienhoefr/drinklist)


The Drinklist is essentially a digital tally sheet which is intended for tracking coffee or beverage self service sales in offices or communities. It is intended to be used very quickly and with very minimal user interaction. This project also includes a management view to manage and track the inventory and the sales.

> Drinklist was originally designed and built for the [FIUS](https://fius.informatik.uni-stuttgart.de) by its members.


## Prerequisites:

 *  npm
 *  sqlite3


## Install

First install all dependencies and setup the data folder with:
```shell
npm install
npm run setup-data-folder
```
This will also compile the TypeScript source, which might take a moment depending on your machine. 

Then start the node js server with:
```shell
npm start
```

or run it directly with:
```shell
node src/server.js
```

Lastly navigate to the [Admin Page](http://localhost:8080/admin) or the [User Page](http://localhost:8080) and start using the system.


## Install with Docker
Container: kienhoefr/drinklist

Start with mapped config dir and forwarded ports:
```shell
docker run -e TZ="Europe/Berlin" -p 8080:8080 -v ~/drinklistData:/app/data kienhoefr/drinklist
```


## Update from 1.0.0

Since version 1.1.0 contains breaking changes you need to migrate your data. There are two paths for this. Either open the `data/history.db` file with any sqlite programm of your choosing and run:
```SQL
ALTER TABLE users ADD COLUMN hidden INTEGER NOT NULL DEFAULT 0;
```

Or go to the install directory with the data folder inside and run this command in a shell:
```shell
sqlite3 data/history.db "ALTER TABLE users ADD COLUMN hidden INTEGER NOT NULL DEFAULT 0;"
```

Additionally it is necessary to create the `data/user-settings.json` file with the following content:
```json
{"imprint":true,"data-protection":true,"recently-purchased":true,"history":true,"money":true}
```

## Update from 1.1

Update 1.2 brings two new configuration settings that must be added to your `data/user-settings.json`.
These two new settings are:
* title - Set the title displayed in the browser's tab when accessing the frontend.
* curencySymbol - Set the currency symbol Drinklist uses to display money values.

Your `data/user-settings.json` file should look like this:
```json
{
  "imprint": true,
  "data-protection": true,
  "recently-purchased": true,
  "history": true,
  "money": true,
  "title": "daGl / TOBL",
  "currencySymbol": "€"
}
```

## Update from 1.2
Update 1.3.0 requires your `data/settings.json` to be changed.

Your `data/settings.json` file should look like this:

```json
{
  "host": "http://localhost:8080",
  "port": 8080
}
```


## Interfaces
| Name       | URL                       | Description                                                   |
|------------|---------------------------|---------------------------------------------------------------|
| API        | http://localhost:8080/api | This is the api used to store and manage all information      |
| Frontend   | http://localhost:8080/    | Frontend for user interaction and administration              |
