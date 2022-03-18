const express = require('express');
const path = require('path');
const notesData = require('./db/db.json');
const ShortUniqueID = require('short-unique-id');
const uid = new ShortUniqueID({
  length: 3,
  dictionary: number
});
const { readFromFile, readAndAppend, removeFromDB } = require('./helpers/fsUtils');

const PORT = 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/api', api);

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);


// GET Route for retrieving all the tips
notes.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for tips`);
  readFromFile('../db/db.json').then((data) => res.json(JSON.parse(data)));
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

    readAndAppend(newNote, '../db/db.json');
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
  return res.json(notes);

})



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
