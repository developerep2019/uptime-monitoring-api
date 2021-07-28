//dependencies
const fs = require('fs');
const path = require('path');

const lib = {};

// base directory of the data folder

lib.basedir = path.join(__dirname, '/../.data/');

//write data to file
lib.create = (dir, file, data, callback) => {
  const writingFilePath = `${lib.basedir + dir}/${file}.json`;
  // open file for writing
  fs.open(writingFilePath, 'wx', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // convert data to string
      const stringData = JSON.stringify(data);

      // write data to file and close it
      fs.writeFile(fileDescriptor, stringData, (err, fileContent) => {
        if (!err) {
          fs.close(fileDescriptor, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback('Error closing the new file');
            }
          });
        } else {
          callback('Error writing to new file!');
        }
      });
    } else {
      callback('There was an error, file may already exists');
    }
  });
};

// read data from file
lib.read = (dir, file, callback) => {
  const readingFilePath = `${lib.basedir + dir}/${file}.json`;
  fs.readFile(readingFilePath, 'utf8', (err, data) => {
    callback(err, data);
  });
};

// update existing file
lib.update = (dir, file, data, callback) => {
  const writingFilePath = `${lib.basedir + dir}/${file}.json`;
  //file open for writing
  fs.open(writingFilePath, 'r+', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // convert data to string
      const stringData = JSON.stringify(data);

      //truncate the file
      fs.ftruncate(fileDescriptor, (err) => {
        if (!err) {
          // write to the file and close it
          fs.writeFile(fileDescriptor, stringData, (err) => {
            if (!err) {
              // close the file
              fs.close(fileDescriptor, (err) => {
                if (!err) {
                  callback(false);
                } else {
                  callback('Error closing file');
                }
              });
            } else {
              callback('Error writing to file');
            }
          });
        } else {
          callback('Error truncating file!');
        }
      });
    } else {
      callback(`Error updating, file may not exist`);
    }
  });
};

// delete existing file
lib.delete = (dir, file, callback) => {
  const deleteFilePath = `${lib.basedir + dir}/${file}.json`;
  //unlinking the file
  fs.unlink(deleteFilePath, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback('Error deleting the file');
    }
  });
};

// list all the itmes in a directory

lib.list = (dir, callback) => {
  fs.readdir(`${lib.basedir + dir}/`, (err, fileNames) => {
    if (!err && fileNames && fileNames.length > 0) {
      let trimmedFileNames = [];
      fileNames.forEach((fileName) => {
        trimmedFileNames.push(fileName.replace('.json', ''));
      });
      callback(false, trimmedFileNames);
    } else {
      callback(500, {
        error: 'Error reading directory',
      });
    }
  });
};

module.exports = lib;
