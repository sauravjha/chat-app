const express = require("express")
const http = require("http")
const path = require("path")
const socketio = require("socket.io")
const Filter = require("bad-words")

const app = express()

const server = http.createServer(app)
const io = socketio(server)

const publicPathDirectory = path.join(__dirname, "../public")

app.use(express.static(publicPathDirectory))

io.on('connection', (socket) => {
    console.log("New connection")

    socket.emit("message", "Wellcome!")

    socket.broadcast.emit("message", "New user has joined")

    socket.on('messageSent', (message, callback) => {
        const filter = new Filter()
        if(filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }
        io.emit('message', message)
        callback('Delivered')
    })

    socket.on('sendLocation', (location, callback) => {
        io.emit('message', `http://www.google.com/maps?q=${location.latitude},${location.longitude}`)
        callback('Location shared!')
    })

    socket.on('disconnect', () => {
        io.emit('message', 'User has left')
    })
})

const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`App running on ${port}`)
})