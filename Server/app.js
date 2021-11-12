let express = require('express')
let bodyParser = require('body-parser')
let fs = require('fs')
let cors = require('cors')

const app = express()
let jsonParser = bodyParser.json()

let notes
let note

app.use(cors())
app.get('/notes', function (req, res) {
    loadingDataNotes()
    res.send(notes)
})

app.get('/notes/:id', function (req, res) {
    loadingDataNotes()
    note = receiveIdNote(note, notes, req.params.id)
    if (note) {
        res.send(note)
    } else {
        res.status(404).send()
    }
})

app.post('/notes', jsonParser, function (req, res) {
    if (!req.body) {
        return res.sendStatus(400)
    }
    loadingDataNotes()
    note = {
        id: notes.reduce((max, item) => item.id > max ? item.id : max, 0) + 1,
        body: req.body.body,
        status: req.body.status,
        dateCreation: new Date(),
    }
    notes.push(note)
    fs.writeFileSync('data.json', JSON.stringify(notes))
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    res.send(note)
})

app.delete('/notes/:id', function (req, res) {
    loadingDataNotes()
    note = receiveIdNote(note, notes, req.params.id)
    if (note) {
        note = notes.splice(notes.indexOf(note), 1)[0]
        fs.writeFileSync('data.json', JSON.stringify(notes))
        res.send(note)
    } else {
        res.status(404).send()
    }
})

app.put('/notes', jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400)
    loadingDataNotes(note, notes)
    note = receiveIdNote(note, notes, req.body.id)
    if (note) {
        note.status = req.body.status
        note.body = req.body.body
        note.dateCreation = new Date();
        fs.writeFileSync('data.json', JSON.stringify(notes))
        res.send(note)
    } else {
        res.status(404).send(note)
    }
})

function loadingDataNotes() {
    notes = JSON.parse(fs.readFileSync('data.json', 'utf8'))
    note = null
}

function receiveIdNote(note, notes, idNote) {
    note = notes.find(item => item.id == idNote)
    if (note === undefined) {
        note = null
    }
    return note
}

app.listen(5000, function () {
    console.log('Сервер ожидает подключения...')
})
