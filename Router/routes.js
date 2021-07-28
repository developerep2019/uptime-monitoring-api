// Application's main Router

// dependencies
const { sampleHandler } = require('../handlers/routeHandlers/sampleHandler');
const { userHandler } = require('../handlers/routeHandlers/userHandler');
const { tokenHandler } = require('../handlers/routeHandlers/tokenHandler');
const { checkHandler } = require('../handlers/routeHandlers/checkHandler');

const routes = {
  token: tokenHandler,
  sample: sampleHandler,
  user: userHandler,
  check: checkHandler,
};

module.exports = routes;
