/**
 * Title: User Route Handler
 * Description: User related Route handler
 * Author: Al Imran Hossain
 * Date: 20/08/2021
 *
 */

// dependencies
const { request } = require('http');
const data = require('../../../lib/data');
const { parseJSON } = require('../../utilities');
const { hash } = require('../../utilities');
const tokenHandler = require('./tokenHandler');

// module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethods = ['get', 'post', 'put', 'delete'];
  if (acceptedMethods.indexOf(requestProperties.method) >= 0) {
    handler._user[requestProperties.method](requestProperties, callback);
  } else {
    console.log('error');
    callback(405);
  }
};

handler._user = {};

// for get method
handler._user.get = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.queryStringObject.phone === 'string' &&
    requestProperties.queryStringObject.phone.trim().length > 0
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    const token =
      typeof requestProperties.headersObject.token === 'string' &&
      requestProperties.headersObject.token.trim().length === 20
        ? requestProperties.headersObject.token
        : false;

    // Verify token
    tokenHandler._token.varify(token, phone, (tokenId) => {
      if (tokenId) {
        // lookup user
        data.read('users', phone, (err, data) => {
          const user = { ...parseJSON(data) };
          if (!err && user) {
            delete user.password;
            callback(200, user);
          } else {
            callback(404, { error: 'Requested user not found' });
          }
        });
      } else {
        callback(404, { error: 'Authentication failure!' });
      }
    });
  } else {
    callback(404, { error: 'Requested user not found' });
  }
};

// for post method
handler._user.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === 'string' &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === 'string' &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

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

  const tosAgreement =
    typeof requestProperties.body.tosAgreement === 'boolean' &&
    requestProperties.body.tosAgreement
      ? requestProperties.body.tosAgreement
      : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    const token =
      typeof requestProperties.headersObject.token === 'string' &&
      requestProperties.headersObject.token.trim().length === 20
        ? requestProperties.headersObject.token
        : false;

    // Verify token
    tokenHandler._token.varify(token, phone, (tokenId) => {
      if (tokenId) {
        // lookup user
        data.read('users', phone, (err, user) => {
          if (err) {
            let userObject = {
              firstName,
              lastName,
              phone,
              password: hash(password),
              tosAgreement,
            };
            data.create('users', phone, userObject, (err) => {
              if (!err) {
                callback(200, {
                  message: 'User has been created successfully',
                });
              } else {
                callback(500, {
                  message: 'User could not created. Server side error',
                });
              }
            });
          } else {
            callback(500, { message: 'Server side error' });
          }
        });
      } else {
        callback(404, { error: 'Authentication failure!' });
      }
    });
  } else {
    callback(400, { error: 'There was a error with your request.' });
  }
};

// for put method
handler._user.put = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === 'string' &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === 'string' &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

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

  if (phone) {
    if (firstName || lastName || password) {
      const token =
        typeof requestProperties.headersObject.token === 'string' &&
        requestProperties.headersObject.token.trim().length === 20
          ? requestProperties.headersObject.token
          : false;

      // Verify token
      tokenHandler._token.varify(token, phone, (tokenId) => {
        if (tokenId) {
          // lookup user
          data.read('users', phone, (err, userData) => {
            let user = { ...parseJSON(userData) };
            if (!err) {
              if (firstName) {
                user.firstName = firstName;
              }
              if (lastName) {
                user.lastName = lastName;
              }
              if (password) {
                user.password = hash(password);
              }
              data.update('users', phone, user, (err) => {
                if (!err) {
                  callback(200, {
                    message: 'User has been updated successfully',
                  });
                } else {
                  callback(500, { error: 'There was a problem in the server' });
                }
              });
            } else {
              callback(400, {
                error: 'Invalid phone number. please try again',
              });
            }
          });
        } else {
          callback(404, { error: 'Authentication failure!' });
        }
      });
    } else {
      callback(400, { error: 'Problem with your request' });
    }
  } else {
    callback(400, { error: 'Invalid phone number. please try again' });
  }
};

// for delete method
handler._user.delete = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.queryStringObject.phone === 'string' &&
    requestProperties.queryStringObject.phone.trim().length > 0
      ? requestProperties.queryStringObject.phone
      : false;
  if (phone) {
    const token =
      typeof requestProperties.headersObject.token === 'string' &&
      requestProperties.headersObject.token.trim().length === 20
        ? requestProperties.headersObject.token
        : false;

    // Verify token
    tokenHandler._token.varify(token, phone, (tokenId) => {
      if (tokenId) {
        // lookup user
        data.read('users', phone, (err, userData) => {
          if (!err && userData) {
            data.delete('users', phone, (err) => {
              if (!err) {
                callback(200, { message: 'User deleted successfully.' });
              } else {
                callback(500, { error: 'There was a problem in server.' });
              }
            });
          } else {
            callback(500, { error: 'There was a problem in server.' });
          }
        });
      } else {
        callback(404, { error: 'Authentication failure!' });
      }
    });
  } else {
    callback(400, { error: 'Invalid your phone number.' });
  }
};

// module export
module.exports = handler;
