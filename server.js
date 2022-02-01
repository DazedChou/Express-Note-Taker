const express = require('express');
const noteData = require('./db/db.json');
const path = require('path');
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));



// GET Route for homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET route for note page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json','utf-8')
        .then((data) => res.send(data));    
});
// res.json(noteData));

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    console.log(req.body);
    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };
        readAndAppend(newNote, './db/db.json');
        res.json("Successfully posted");
    }
});

// Delete Route
app.delete('/api/notes/:id', (req, res) => {
    // console.log(req.params.id);
    const currentId = req.params.id;
    readFromFile('./db/db.json','utf-8')
    .then((data) => {
        data = JSON.parse(data);
        console.log(data[0].id);
        
        for (let i = 0 ; i < data.length ; i++){
            if ( data[i].id == currentId){
                data.splice(i,1);
                console.log(data);
                data = JSON.stringify(data);
                fs.writeFileSync('./db/db.json',data);
            }
        }
    });
    res.send('item deleted');
})

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);