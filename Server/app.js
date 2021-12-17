let express = require('express')
let fs = require('fs')
let cors = require('cors')
const authRouter = require('./authRouter')
const app = express()
const authMiddleware = require('./middlewarre/authMiddleware')
let notes
let note
app.use(express.json())
app.use(cors())
app.use("/auth", authRouter)


app.get('/notes', authMiddleware, function (req, res) {
    loadingDataNotes()
    const result = notes.filter(note => Number(note.idUser) === Number(req.user.idUser))
    res.send(result)
})

app.get('/notes/:id', authMiddleware, function (req, res) {
    loadingDataNotes()
    note = receiveIdNote(note, notes, req.params.id)
    if (note && Number(note.idUser) === Number(req.user.idUser)) {
        res.send(note)
    } else {
        res.status(404).send({message: "Ошибка. Запись не найдена"})
    }
})

app.post('/notes', authMiddleware, function (req, res) {
    if (!req.body) {
        return res.sendStatus(400)
    }
    loadingDataNotes()
    note = {
        idUser: req.user.idUser,
        id: notes.reduce((max, item) => item.id > max ? item.id : max, 0) + 1,
        body: req.body.body,
        status: false,
        dateCreation: new Date(),
    }
    notes.unshift(note)
    fs.writeFileSync('data.json', JSON.stringify(notes))
    const result = notes.filter(note => Number(note.idUser) === Number(req.user.idUser))
    res.send(result)
})

app.delete('/notes/:id', authMiddleware, function (req, res) {
    loadingDataNotes()
    note = receiveIdNote(note, notes, req.params.id)
    if (note && Number(note.idUser) === Number(req.user.idUser)) {
        note = notes.splice(notes.indexOf(note), 1)[0]
        fs.writeFileSync('data.json', JSON.stringify(notes))
        const result = notes.filter(note => Number(note.idUser) === Number(req.user.idUser))
        res.send(result)
    } else {
        res.status(404).send({message: "Ошибка. Запись не найдена"})
    }
})

app.put('/notes', authMiddleware, function (req, res) {
    if (!req.body) return res.sendStatus(400)
    loadingDataNotes(note, notes)
    note = receiveIdNote(note, notes, req.body.id)
    if (note && Number(note.idUser) === Number(req.user.idUser)) {
        note.status = req.body.status
        note.body = req.body.body
        note.dateCreation = new Date();
        fs.writeFileSync('data.json', JSON.stringify(notes))
        const result = notes.filter(note => Number(note.idUser) === Number(req.user.idUser))
        res.send(result)
    } else {
        res.status(404).send({message: "Ошибка. Запись не найдена"})
    }
})

function loadingDataNotes() {
    notes = JSON.parse(fs.readFileSync('data.json', 'utf8'))
    note = null
}

function receiveIdNote(note, notes, idNote) {
    note = notes.find(item => Number(item.id) === Number(idNote))
    if (note === undefined) {
        note = null
    }
    return note
}

app.listen(5000, function () {
    console.log('Сервер ожидает подключения...')
})
