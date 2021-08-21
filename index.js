/*
 * Title: Uptime Monitoring Application
 * Description: A RESTFul API to moitor up or down time of user defined links
 * Author: Al Imran Hossain
 * Date: 19/08/2021
 *
 */

// dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');
const data = require('./lib/data');

// app object - Module scaffolding
const app = {};

// testing file system
// @TODO will be remove
// data.create(
//   'test',
//   'newFile',
//   { country: 'Bangladesh', language: 'Bangla' },
//   (err) => {
//     console.log('Error is ', err);
//   }
// );

// data.read('test', 'newFile', (err, data) => {
//   console.log(err, data);
// });

// data.update(
//   'test',
//   'newFile',
//   { country: 'America', language: 'English' },
//   (err) => {
//     console.log('Error is ', err);
//   }
// );

// data.delete('test', 'newFile', (err) => {
//   console.log('Error is ', err);
// });

// create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environment.port, () => {
    console.log(`Listening to port ${environment.port}`);
  });
};

// handle request response
app.handleReqRes = handleReqRes;
// start the server
app.createServer();
