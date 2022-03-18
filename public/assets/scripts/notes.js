const notesForm = document.getElementById('feedback-form');

const notes = require('express').Router();
const { readFromFile, readAndAppend, removeFromDB } = require('../../../helpers/fsUtils');
const uuid = require('../../../helpers/uuid');
const notesData = require('../../../db/db.json');

// GET Route for retrieving all the tips
notes.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for tips`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// POST Route for a new UX/UI tip
notes.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);
  console.log(req.body);

  const { noteTitle, noteText } = req.body;

  if (req.body) {
    const newNote = {
      noteTitle,
      noteText,
      note_id: uuid(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully 🚀`);
  } else {
    res.error('Error in adding Note');
  }
});


// THIS IS THE BONUS ... to delete from the db
notes.delete('/api/notes/:id', (req, res) => {
  console.info(`${req.method} request received for tips`);
  console.log(req.body);

  const requestedID = req.params.id.toLowerCase();

  for (let i = 0; i < notesData.length; i++) {
    const currentNoteID = notesData[i].id;
    if (requestedID === currentNoteID) {
      // result.push(notesData[i]);

      // reformOfNotesData.splice(i, 1);
      let indexToBeRemoved = i;
      console.log("index to be removed is:\n");
      console.log(indexToBeRemoved);

      console.log("Full Entry to be Removed Is: \n");
      console.log(notesData[i]);

      // USE THE NEWLY-MADE removeFromDB FUNCTION
      removeFromDB(indexToBeRemoved, '../db/db.json')

    }
  }
  return res.json(result);

})

module.exports = notes;
