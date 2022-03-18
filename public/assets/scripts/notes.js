const notesForm = document.getElementById('notes-form');

notesForm.addEventListener('submit', (e) => {

  e.preventDefault();

  // Get the feedback text from the DOM and assign it to a variable
  let noteTitle = document.getElementById('feedbackText').value;
  // Get the username text and add it to a variable
  let noteText = document.getElementById('feedbackUsername').value.trim();

  // Create an object with the username and feedback
  const newNote = {
    noteTitle,
    noteText
  };

  // Fetch POST request to the server
  fetch('api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newNote),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.status);
      noteTitle = '';
      noteText = '';
    });
})
.catch((error) => {
  console.error('Error:', error);
});


module.exports = notes;
