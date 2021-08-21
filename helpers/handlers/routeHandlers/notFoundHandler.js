/**
 * Title: Not Found Handler
 * Description: Not Found Route handler
 * Author: Al Imran Hossain
 * Date: 19/08/2021
 *
 */

// module scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
  console.log(requestProperties);
  callback(404, {
    message: 'Your requested url was not found',
  });
};

module.exports = handler;
