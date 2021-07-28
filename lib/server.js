/**
 * Prject Name : Server library
 * Project Description : Server related files
 * Author : MD Habibul Hasan
 * Date : 28/07/2021
 */

const http = require('http');
const { handleReqRes } = require('../helpers/handleReqRes');

// app object - module scaffolding
const server = {};

// configuration
server.config = {
  port: 3000,
};

// create server
server.createServer = () => {
  const createServerVariable = http.createServer(server.handleReqRes);
  createServerVariable.listen(server.config.port, () => {
    console.log(`listening to port ${server.config.port}`);
  });
};

// handle Request Response
server.handleReqRes = handleReqRes;

// start the server
server.init = () => {
  server.createServer();
};

module.exports = server;
