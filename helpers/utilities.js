/**
 * Title: Utilities
 * Description: Important utilities
 * Author: Al Imran Hossain
 * Date: 20/08/2021
 *
 */

// dependencies
const crypto = require('crypto');
const environments = require('./environments');

// module scaffolding
const utilities = {};

// parse JSON string to objec
utilities.parseJSON = (jsonString) => {
  let output = {};
  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }

  // return output
  return output;
};

utilities.hash = (str) => {
  if (typeof str === 'string' && str.length > 0) {
    let hash = crypto
      .createHmac('sha256', environments.secretKey)
      .update(str)
      .digest('hex');
    return hash;
  } else {
    return false;
  }
};

//module export
module.exports = utilities;
