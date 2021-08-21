// dependencies
const fs = require('fs');
const path = require('path');

// module scaffolding
const lib = {};

// base directory of data
lib.basedir = path.join(__dirname, '/../.data/');

// write data to file
lib.create = (dir, file, data, callback) => {
  //open file for writing
  fs.open(
    lib.basedir + dir + '/' + file + '.json',
    'wx',
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // convert data to string
        const stringData = JSON.stringify(data);

        // write data to file and then close it
        fs.writeFile(fileDescriptor, stringData, (errWF) => {
          if (!errWF) {
            fs.close(fileDescriptor, (errC) => {
              if (!errC) {
                callback(false);
              } else {
                callback('Error file closing');
              }
            });
          } else {
            callback('Error writing new file');
          }
        });
      } else {
        callback('Could not create new file, it may already exists');
      }
    }
  );
};

// read data from file
lib.read = (dir, file, callback) => {
  fs.readFile(
    lib.basedir + dir + '/' + file + '.json',
    'utf-8',
    (err, data) => {
      callback(err, data);
    }
  );
};

// update existing file
lib.update = (dir, file, data, callback) => {
  const stringData = JSON.stringify(data);
  const fileDescriptor = `${lib.basedir + dir}/${file}.json`;

  fs.writeFile(fileDescriptor, stringData, (err) => {
    if (!err) {
      callback(false);
    } else {
      console.log('Error writing ');
    }
  });

  // fs.open(lib.basedir + dir + '/' + file + '.json', (err, fileDescriptor) => {
  //   if (!err) {
  //     // convert data to string
  //     const stringData = JSON.stringify(data);

  //     // truncate existing file
  //     fs.ftruncate(fileDescriptor, (err) => {
  //       if (!err) {
  //         // write to the file and close it
  //         fs.writeFile(fileDescriptor, stringData, (err) => {
  //           if (!err) {
  //             fs.close(fileDescriptor, (err) => {
  //               if (!err) {
  //                 callback(false);
  //               } else {
  //                 console.log('Error closeing');
  //               }
  //             });
  //           } else {
  //             console.log('Error writing ');
  //           }
  //         });
  //       } else {
  //         console.log('Error truncating file ' + err);
  //       }
  //     });
  //   } else {
  //     console.log('Error updating file. File may not exist');
  //   }
  // });
};

// delete file
lib.delete = (dir, file, callback) => {
  // unlink file
  fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      console.log('Error deleting');
    }
  });
};

// Export module
module.exports = lib;
