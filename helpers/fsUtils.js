// PULLING IN NECESSARY, FILE SYSTEM (read/write) and UTIL (for promisify)
const fs = require('fs');
const util = require('util');

// PROMISIFY, TO ENSURE IT'S FINISHED BEFORE IT CONTINUES TO THE NEXT PROCESS
const readFromFile = util.promisify(fs.readFile);

// WRITES/OVERWRITES A FILE, IN THIS CASE, IS BUILT TO PULL IN A NEWLY-UPDATED ARRAY OF OBJECTS (NOTES) AND OVERWRITE THE "DB.JSON" FILE
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

// USED TO POSTING A NEW NOTE TO THE ARRAY OF OBJECTS
const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};


// THIS IS THE BONUS, to remove a note from the db
const removeFromDB = (indexToDelete, file) => {
  fs.readFile(file, 'utf8', (err, origString) => {
    if (err) {
      console.error(err);
    } else {
      let parsedData = JSON.parse(origString);
      parsedData.splice(indexToDelete, 1);
      fs.writeFile('./db/db.json', JSON.stringify(parsedData, null, 4), (err) =>
        err ? console.error(err) : console.info(`\nNew DELETION was made.`)
        )
    }
  });
}

module.exports = { readFromFile, writeToFile, readAndAppend, removeFromDB };
