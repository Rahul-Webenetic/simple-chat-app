const express = require("express")
const { createServer } = require("http")
const path = require("path")
const { Server } = require("socket.io")

const app = express()
const server = createServer(app)
const io = new Server(server)

app.use(express.static(path.join(__dirname, "public")))

//~ IO is the entire server that allows communication
//~ socket is one specific client that joins and leaves the server (For e.g. a browser tab in our case).
io.on("connection", (socket) => {
  // To everyone except the user
  socket.broadcast.emit("message", "A user connected")

  socket.on("chatMessage", (msg) => {
    io.emit("message", msg)
  })

  // Send msg on disconnection to server and clients too
  socket.on("disconnect", () => {
    io.emit("message", "A user has disconnected")
  })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`)
})

// app.get("/", (req, res) => {

//   res.status(200).send("Hello There")
// })
