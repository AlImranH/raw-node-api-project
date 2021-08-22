/**
 * Title: Token Route Handler
 * Description: Token related Route handler
 * Author: Al Imran Hossain
 * Date: 20/08/2021
 *
 */

// dependencies
const data = require('../../../lib/data');
const { hash, createRandomString, parseJSON } = require('../../utilities');

// module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMethods = ['get', 'post', 'put', 'delete'];
  if (acceptedMethods.indexOf(requestProperties.method) >= 0) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    console.log('error');
    callback(405);
  }
};

handler._token = {};

// for get method
handler._token.get = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === 'string' &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;
  if (id) {
    //lookup token
    data.read('tokens', id, (err, tokenData) => {
      const token = { ...parseJSON(tokenData) };
      if (!err && token) {
        callback(200, token);
      } else {
        callback(404, { error: 'Requested token was not found!' });
      }
    });
  } else {
    callback(404, { error: 'Requested token was not found!' });
  }
};

// for post method
handler._token.post = (requestProperties, callback) => {
  const password =
    typeof requestProperties.body.password === 'string' &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  const phone =
    typeof requestProperties.body.phone === 'string' &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  if (phone && password) {
    const hashedPass = hash(password);
    data.read('users', phone, (err, userData) => {
      if (!err) {
        if (hashedPass === parseJSON(userData).password) {
          //create token
          const tokenId = createRandomString(20);
          const expire = Date.now() + 60 * 60 * 1000;
          const tokenObject = {
            phone,
            id: tokenId,
            expire,
          };

          // Store token
          data.create('tokens', tokenId, tokenObject, (err) => {
            if (!err) {
              callback(200, tokenObject);
            } else {
              callback(500, { error: 'There was a server error!' });
            }
          });
        } else {
          callback(400, { error: 'Invalid password!' });
        }
      } else {
        callback(400, { error: 'Invalid phone!' });
      }
    });
  } else {
    callback(400, { error: 'There was a error with your request.' });
  }
};

// for put method
handler._token.put = (requestProperties, callback) => {
  const id =
    typeof requestProperties.body.id === 'string' &&
    requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;

  const extn =
    typeof requestProperties.body.extn === 'boolean' &&
    requestProperties.body.extn
      ? requestProperties.body.extn
      : false;

  if (id && extn) {
    data.read('tokens', id, (err, tokenData) => {
      let token = { ...parseJSON(tokenData) };
      if (token.expire > Date.now()) {
        if (!err && token) {
          token.expire = Date.now() + 60 * 60 * 1000;
          data.update('tokens', id, token, (err) => {
            if (!err) {
              callback(200, { message: 'Token extended.' });
            } else {
              callback(500, { error: 'There was a server problem!' });
            }
          });
        } else {
          callback(404, { error: 'Invalid token' });
        }
      } else {
        callback(400, { error: 'Token already expired!' });
      }
    });
  } else {
    callback(400, { error: 'There was an error with your request!' });
  }
};

// for delete method
handler._token.delete = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === 'string' &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    data.read('tokens', id, (err, tokenData) => {
      if (!err && tokenData) {
        data.delete('tokens', id, (err) => {
          if (!err) {
            callback(200, { message: 'Token deleted' });
          } else {
            callback(500, { error: 'There was a error in server' });
          }
        });
      } else {
        callback(400, { error: 'There was a problem with your request' });
      }
    });
  } else {
    callback(400, { error: 'There was a problem with your request' });
  }
};

handler._token.varify = (id, phone, callback) => {
  data.read('tokens', id, (err, tokenData) => {
    if (!err && tokenData) {
      if (
        parseJSON(tokenData).phone === phone &&
        parseJSON(tokenData).expire > Date.now()
      ) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

// module export
module.exports = handler;
