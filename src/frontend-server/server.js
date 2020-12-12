/*
* The frontend for Drinklist
* ------------------------
* Author: Sandro Speth
* Author: Tobias Wältken
* Author: Raphael Kienhöfer
*/

/* jslint esversion: 6 */

// Imports
const fs = require('fs');
const express = require('express');

// Constants
const app = module.exports = express();
const dirname = fs.realpathSync('./');
const wwwroot = __dirname + '/wwwroot';

var settings = JSON.parse(fs.readFileSync(dirname + '/data/user-settings.json', 'utf-8'));

app.get('/settings', (req, res) => {
  const config = {
    settings,
    api: app.locals.apiPath,
  };
  console.log('[frontend] [load] settings');
  res.status(200).json(config);
});

app.get('/legal', (req, res) => {
  console.log('[frontend] [load] legal.html');
  res.status(200).sendFile(dirname + '/data/legal.html');
});

app.get('/imprint', (req, res) => {
  console.log('[frontend] [load] imprint.html');
  res.status(200).sendFile(dirname + '/data/imprint.html');
});

app.use(express.static(wwwroot))

app.get('/', (req, res) => {
  console.log('[frontend] [load] index.html');
  res.status(200).sendFile(wwwroot + '/index.html');
});

app.get('/*', (req, res) => {
  console.log(`[frontend] [load] index.html ${req.path}`);
  res.status(200).sendFile(wwwroot + '/index.html');
});
