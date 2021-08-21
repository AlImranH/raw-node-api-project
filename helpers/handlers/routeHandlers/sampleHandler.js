/**
 * Title: Sample Handler
 * Description: Sample Route handler
 * Author: Al Imran Hossain
 * Date: 19/08/2021
 *
 */

// module scaffolding
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
  console.log(requestProperties);
  callback(200, {
    message: 'This a sample url',
  });
};

module.exports = handler;
