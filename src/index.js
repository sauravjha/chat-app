const express = require("express")
const http = require("http")
const path = require("path")
const socketio = require("socket.io")

const app = express()

const server = http.createServer(app)
const io = socketio(server)

const publicPathDirectory = path.join(__dirname, "../public")

app.use(express.static(publicPathDirectory))

let count = 0

io.on('connection', (socket) => {
    console.log("New connection")
    socket.emit("countUpdated", count)
    socket.on("increment", () => {
        count ++
        //socket.emit("countUpdated", count)
        io.emit("countUpdated", count)
    })
})

const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`App running on ${port}`)
})