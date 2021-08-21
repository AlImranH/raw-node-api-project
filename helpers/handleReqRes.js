/**
 * Title: Handle Request Response
 * Description: Handle Request and response
 * Author: Al Imran Hossain
 * Date: 10/08/2021
 *
 */

// dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('./routes');
const { notFoundHandler } = require('./handlers/routeHandlers/notFoundHandler');
const { parseJSON } = require('../helpers/utilities');

// module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
  // request handle
  // get the url and parse it
  const parseUrl = url.parse(req.url, true);
  const path = parseUrl.pathname;

  // remove special character from url
  const trimedPath = path.replace(/^\/+|\/+$/g, '');

  // get requst method
  const method = req.method.toLowerCase();

  // get query string from url
  const queryStringObject = parseUrl.query;

  // get header from url
  const headersObject = req.headers;

  const requestProperties = {
    parseUrl,
    path,
    trimedPath,
    method,
    queryStringObject,
    headersObject,
  };

  // get body
  const decoder = new StringDecoder('utf-8');
  let realData = '';

  const chosenHandler = routes[trimedPath]
    ? routes[trimedPath]
    : notFoundHandler;

  req.on('data', (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on('end', () => {
    realData += decoder.end();

    requestProperties.body = parseJSON(realData);

    chosenHandler(requestProperties, (statusCode, payload) => {
      statusCode = typeof statusCode === 'number' ? statusCode : 500;
      payload = typeof payload === 'object' ? payload : {};

      const payloadString = JSON.stringify(payload);

      // return response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
};

module.exports = handler;
