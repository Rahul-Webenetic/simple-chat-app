const express = require("express")
const { createServer } = require("http")
const path = require("path")
const { Server } = require("socket.io")
const { formatMessage } = require("./utils/messages")
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users")

const app = express()
const server = createServer(app)
const io = new Server(server)

app.use(express.static(path.join(__dirname, "public")))
const botName = "ChatCord Bot"

//~ IO is the entire server that allows communication
//~ socket is one specific client that joins and leaves the server (For e.g. a browser tab in our case).
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room)
    // console.log(socket)
    socket.join(user.room)

    socket.emit("message", formatMessage(botName, "Welcome to chat"))

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${username} has joined the chat`)
      )

    io.to(user.room).emit("roomMembers", {
      room: user.room,
      users: getRoomUsers(user.room),
    })
  })

  // To everyone except the user
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id)

    io.to(user.room).emit("message", formatMessage(user.username, msg))
  })

  //* WIP
  // Send msg on disconnection to server and clients too
  socket.on("disconnect", () => {
    const user = userLeave(socket.id)

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      )
      io.to(user.room).emit("roomMembers", {
        room: user.room,
        users: getRoomUsers(user.room),
      })
    }
    // io.emit("message", "A user has disconnected")
  })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`)
})

// app.get("/", (req, res) => {

//   res.status(200).send("Hello There")
// })
