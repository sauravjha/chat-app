const express = require("express")
const http = require("http")
const path = require("path")
const socketio = require("socket.io")
const Filter = require("bad-words")
const { generateMessage, generateLocationMessage } = require("./utils/messages")
const { addUser,removeUser, getUser, getUsersInRoom} = require("./utils/users")
const app = express()

const server = http.createServer(app)
const io = socketio(server)

const publicPathDirectory = path.join(__dirname, "../public")

app.use(express.static(publicPathDirectory))

io.on('connection', (socket) => {
    console.log("New connection")

    socket.on('join', ({ username, room }, callback ) => {
        const {error, user} = addUser({ id: socket.id, username: username, room: room})
        if(error) {
            return callback(error)
        }
        socket.join(user.room)

        socket.emit("message", generateMessage(`Welcome ${user.username}!`))
        socket.broadcast.to(user.room).emit("message", generateMessage(`${user.username} has joined`))

        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    })

    socket.on('messageSent', (message, callback) => {
        const filter = new Filter()
        const user = getUser(socket.id)
        if(!user) {
            return callback('You are in the wrong room')
        }
        
        if(filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback('Delivered')
    })

    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id)
        if(!user) {
            return callback('You are in the wrong room')
        }
        const url = `http://www.google.com/maps?q=${location.latitude},${location.longitude})`
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, url))
        callback('Location shared!')
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`App running on ${port}`)
})