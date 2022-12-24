# Drinklist

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![Docker](http://dockeri.co/image/kienhoefr/drinklist)](https://hub.docker.com/r/kienhoefr/drinklist)

The Drinklist is essentially a digital tally sheet which is intended for tracking coffee or beverage self-service sales
in offices or communities. It is intended to be used very quickly and with very minimal user interaction. This project
also includes a management view to manage and track the inventory and the sales.

> Drinklist was originally designed and built for the [FIUS](https://fius.de) by its members.

<!-- TOC -->
* [Drinklist](#drinklist)
  * [Prerequisites](#prerequisites)
  * [Install locally](#install-locally)
  * [Run with Docker (recommended)](#run-with-docker--recommended-)
  * [Configuration](#configuration)
    * [user-settings.json](#user-settingsjson)
    * [config.json](#configjson)
    * [auth.json](#authjson)
  * [Upgrading](#upgrading)
  * [Interfaces](#interfaces)
<!-- TOC -->

## Prerequisites

* npm
* sqlite3

## Install locally

First install all dependencies and build the typescript sources with:

```shell
npm install
npm build
```

Then start the node js server with:

```shell
npm start
```

or run it directly with:

```shell
node .
# OR
node dist/express/main.js
```

Now go to http://localhost:8080 to start using Drinklist.

## Run with Docker (recommended)

Image: `kienhoefr/drinklist`

Start with mapped config dir and forwarded ports:

```shell
docker run -e TZ="Europe/Berlin" -p 8080:8080 -v ~/drinklistData:/app/data kienhoefr/drinklist
```

You can also run Drinklist using docker-compose:

```yaml
services:
  drinklist:
    image: kienhoefr/drinklist
    # You may also use the GitHub registry:
    #image: ghcr.io/kienhoefr/drinklist
    container_name: drinklist
    restart: unless-stopped
    ports:
      # Change to your liking or don't expose the port when you use an internal reverse proxy
      - 8080:8080
    volumes:
      # Use local bind mount
      - ./data:/app/data
      # Alternatively use docker volume
      #- drinklist-data:/app/data
    environment:
      # Optionally set the containers timezone. As all dates are saved in UTC there is not real need.
      # HOWEVER, it is recommended to set the timezone when upgrading from 1.x, as Drinklist will automatically migrate the database.
      TZ: Europe/Berlin

# When using docker volume to store the data
#volumes:
#  drinklist-data:
#    name: drinklist-data
```

## Configuration

When first starting Drinklist, it will display a configuration page that can be used to configure Drinklist to your
liking.

These settings are available:

### user-settings.json

| Setting           | Default       | Explanation                                                             |
|-------------------|---------------|-------------------------------------------------------------------------|
| title             | `"dagl/TOBL"` | The page title displayed in the Browser. You can use this for branding. |
| currencySymbol    | `"€"`         | Symbol used to display monetary values.                                 |
| stock             | `true`        | Whether to display stock counts on the user page                        |
| imprint           | `true`        | Whether to display the button for the imprint                           |
| dataProtection    | `true`        | Whether to display the button for the privacy statement.                |
| recentlyPurchased | `true`        | Enable/disable the ticker on the user selection page.                   |    

### config.json

| Setting | Default | Explanation           |
|---------|---------|-----------------------|
| port    | 8080    | The port to listen on |

### auth.json

This file contains the passwords for the Drinklist users in plaintext for greater ease of use.
In the future, Drinklist might change to hashing/salting the passwords.

| Account | Explanation                                                                                                                                                                                                                   |
|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| kiosk   | The account for your users to use or for the fridge tablet to login with.<br/>This account can see all users' accounts/balances and "buy" beverages for every user.                                                           |
| admin   | This account can do all of the above, plus is able to manage Drinklist (i.e. login on the admin area and add/remove/edit users, beverages and more settings.<br/>You should only use this account for administering Drinklist |

## Upgrading

Updates prior to 2.0 need manual steps to be done when updating. Instructions for these can be
found [here](UPGRADING.md).

When updating to version 2.0, Drinklist will back up all you data files to a `backup` directory in your data folder, so
you can roll back if anything goes wrong.

## Interfaces

| Name     | URL                       | Description                                              |
|----------|---------------------------|----------------------------------------------------------|
| API      | http://localhost:8080/api | This is the api used to store and manage all information |
| Frontend | http://localhost:8080/    | Frontend for user interaction and administration         |
