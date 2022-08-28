const express = require('express');
const path = require('path');
const notesDB = require('./db/db.json');
const fs = require("fs");
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();


// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => 
  res.json(notesDB)
);

app.post('/api/notes', (req, res) => {
  const {title, text} = req.body;
  const newNote = {
    title,
    text,
    id: uuid(),
  }
  notesDB.push(newNote);
  res.json(notesDB);
  console.log(notesDB);


  fs.writeFile(`./db/db.json`, JSON.stringify(notesDB, null, 4), (err) =>
  err
    ? console.error(err)
    : console.log(
        `Note has been written to JSON file`
      )
  );
});

app.delete('/api/notes/:id', (req, res) => {
  const clickedID  = req.params.id;
  console.log(clickedID)

  res.json(notesDB);
  
  let noteToDelete;
  for(i = 0; i < notesDB.length; i++) {
    let id = notesDB[i].id;
    if (id == clickedID) {
      console.log("hit")
      noteToDelete = i;
      break;
    }
  }

  console.log(noteToDelete);
  notesDB.splice(noteToDelete, 1);
  console.log(notesDB)
  fs.writeFile(`./db/db.json`, JSON.stringify(notesDB, null, 4), (err) =>
  err
    ? console.error(err)
    : console.log(
        `Note has been DELETED from JSON file`
      )
  );
});



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
