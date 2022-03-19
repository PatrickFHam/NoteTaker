// PULLS-IN THE REQUIRED EXPRESS, PATH, AND FUNCTIONS FROM THE FOLDER 'HELPERS'
const express = require('express');
const path = require('path');
const { clog } = require('./middleware/clog');
const ShortUniqueID = require('short-unique-id');
// "UID" is an 'npm' package that a scalable randomizer, used with these note ID numbers.
const uid = new ShortUniqueID({
  length: 3,
  dictionary: "number"
});
const { readFromFile, readAndAppend, removeFromDB, } = require('./helpers/fsUtils');

// ASSIGNED PORT NUMBER, ALSO ASSIGNS VARIABLE NAME TO EXPRESS.JS
const PORT = 3001;
const app = express();

// GIVES VARIABLE NAME TO THE NOTES DATABASE, PULLS IT IN FOR USE
let notesData = require('./db/db.json');

// Middleware for parsing JSON and urlencoded form data
app.use(clog);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/api', api);

app.use(express.static('public'));


// wHEN BROWSER PATH NAVIGATES TO ROOT OF THE LOCAL HOST PORT, FORCES TO SHOW PUBLIC INDEX.HTML
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);


// wHEN BROWSER PATH NAVIGATES TO PATH "http://localhost:3001/notes", FORCES TO SHOW PUBLIC INDEX.HTML
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);


// GET Route for retrieving all the notes
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received to GET all notes`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  return res.json;
});


// GET Route for retrieing a specific tip, by ID Number
app.get('/api/notes/:id', (req, res) => {
  console.info(`${req.method} request received to GET a specific note by id#`);
  const requestedNote = req.params.id.toLowerCase();

  // This was added to refresh the contents of the 'notesData' array of objects, if a post or delete were made.
  readFromFile('./db/db.json').then((data) => notesData = JSON.parse(data));

  if (requestedNote) {
    for (let i = 0; i < notesData.length; i++) {
      if (requestedNote === notesData[i].id.toLowerCase()) {
        return res.json(notesData[i]);
      }
    }
  }

  return res.json('No term found');
});


// POST Route for a new note
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to POST a note`);
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uid()
    };

    readAndAppend(newNote, './db/db.json');

    // This was added to refresh the contents of the 'notesData' array of objects, if a post or delete were made.
    readFromFile('./db/db.json').then((data) => notesData = JSON.parse(data));

    res.json(`Note with title '${newNote.title}' added successfully 🚀`);
  } else {
    res.error('Error in adding Note');
  }
});


// DELETE Route for deleting a note (by ID#)
app.delete('/api/notes/:id', (req, res) => {
  console.info(`${req.method} request received to DELETE a note`);

  let requestedID = req.params.id.toLowerCase();

  // This was added to refresh the contents of the 'notesData' array of objects, if a post or delete were made.
  readFromFile('./db/db.json').then((data) => notesData = JSON.parse(data));

  let titleToBeRemoved = "";

  for (let i = 0; i < notesData.length; i++) {
    let currentNoteID = notesData[i].id;
    if (requestedID === currentNoteID) {

      let indexToBeRemoved = i;
      titleToBeRemoved = notesData[i].title;
      removeFromDB(indexToBeRemoved, './db/db.json');
    }
  }
  res.json(`Note ID# ${requestedID} entitled '${titleToBeRemoved}' DELETED successfully 🚀`);
})


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
