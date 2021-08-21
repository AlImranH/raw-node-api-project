/**
 * Title: Environments variables
 * Description: Environments Variables
 * Author: Al Imran Hossain
 * Date: 19/08/2021
 *
 */

// Dependencies

// module scaffolding
const environments = {};

environments.staging = {
  port: 3000,
  envName: 'staging',
  secretKey: 'sdlfjlkjlkljlk',
};

environments.production = {
  port: 5000,
  envName: 'production',
  secretKey: 'sdjflksdjfl',
};

//determind which environment was pass
const currentEnvironment =
  typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// Export corresponding environment objec
const environtmentToExport =
  typeof environments[currentEnvironment] === 'object'
    ? environments[currentEnvironment]
    : environments.staging;

// Export module
module.exports = environtmentToExport;
