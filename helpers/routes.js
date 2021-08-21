/**
 * Title: Routes
 * Description: Application routes
 * Author: Al Imran Hossain
 * Date: 19/08/2021
 *
 */

// dependencies
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');
const { userHandler } = require('./handlers/routeHandlers/userHandler');

// module scaffolding
const routes = {
  sample: sampleHandler,
  user: userHandler,
};

module.exports = routes;
