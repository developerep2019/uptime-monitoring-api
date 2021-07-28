/**
 * Prject Name : Uptime Monitoring api with raw Node.js
 * Project Description : A api system for checking the uptime and downtime of a server
 * Author : MD Habibul Hasan
 * Date : 21/07/2021
 */

const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const { sendTwilioSms } = require('./helpers/notifications');
const server = require('./lib/server');
const workers = require('./lib/worker');

// app object - module scaffolding
const app = {};

app.init = () => {
  //start the server
  server.init();

  //start the workers
  workers.init();
};

app.init();

//export the app

module.exports = app;
