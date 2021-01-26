# Drinklist
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![Docker](http://dockeri.co/image/fius/drinklist)](https://hub.docker.com/r/fius/drinklist)


The Drinklist is essentially a digital tally sheet which is intended for tracking coffee or beverage self service sales in offices or communities. It is intended to be used very quickly and with very minimal user interaction. This project also includes a management view to manage and track the inventory and the sales.

> This was designed and build for the [FIUS](https://fius.informatik.uni-stuttgart.de) by its members.


## Prerequisites:

 *  npm
 *  sqlite3


## Install

First install all dependencies and setup the data folder with:
```Bash
npm install
npm run setup-data-folder
```
This will also compile and deploy the frontend, which might take a moment depending on your machine. 

Then start the node js server with:
```Bash
npm start
```

or run it directly with:
```Bash
node src/server.js
```

Lastly navigate to the [Admin Page](http://localhost:8082) or the [User Page](http://localhost:8081) and start using the system.


## Install with Docker
Container: neumantm/drinklist

Start with mapped config dir and forarded ports:
```
docker run -e TZ="Europe/Berlin" -p 8080:8080 -p 8081:8081 -v ~/drinklistData:/app/data fius/drinklist
```


## Update from 1.0.0

Since version 1.1.0 contains breaking changes you need to migrate your data. There are two paths for this. Either open the `data/history.db` file with any sqlite programm of your choosing and run:
```SQL
ALTER TABLE users ADD COLUMN hidden INTEGER NOT NULL DEFAULT 0;
```

Or go to the install directory with the data folder inside and run this command in a shell:
```Bash
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


## Interfaces
| Name       | Port | Description                                                                                  |
|------------|------|----------------------------------------------------------------------------------------------|
| API        | 8080 | This is the api used to store and manage all information                                     |
| Frontend   | 8081 | Frontend for user interaction and administration                                             |
