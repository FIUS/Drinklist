# Drinklist
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The Drinklist is essentially a digital tally sheet which is intended for tracking coffee or beverage self service sales in offices or communities. It is intended to be used very quickly and with very minimal user interaction. This project also includes a management view to manage and track the inventory and the sales.

> This was designed and buid for the [FIUS](https://fius.informatik.uni-stuttgart.de) by its members.

## Prerequisites:

 *  npm
 *  sqlite3


## Install

First install all dependencies and setup the data folder with:
```Bash
npm install
npm run setup-data-folder
```

Then start the node js server with:
```Bash
npm start
```

or run it directly with:
```Bash
node src/server.js
```

Lastly navigate to the [Admin Page](http://localhost:8082) or the [User Page](http://localhost:8081) and start using the system.

## Interfaces
| Name       | Port | Description                                                                                  |
|------------|------|----------------------------------------------------------------------------------------------|
| API        | 8080 | This is the api used to store and manage all informations                                    |
| user page  | 8081 | This is the page accessible for the users to mark there 'expenses'                           |
| admin page | 8082 | This is the page used by the administrators to add and track beverages and view the accounts |
