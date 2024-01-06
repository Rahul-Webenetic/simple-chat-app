const socket = io()
const form = document.getElementById("chat-form")
const chatMessages = document.querySelector(".chat-messages")
const roomName = document.getElementById("room-name")
const roomUsers = document.getElementById("users")
console.log({ roomUsers, roomName })
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
})

// Join chatroom
socket.emit("joinRoom", { username, room })

socket.on("message", (message) => {
  console.log(message)
  appendMessage(message)
  chatMessages.scrollTop = chatMessages.scrollHeight
})

socket.on("roomMembers", ({ room, users }) => {
  appendRoomName(room)
  appendUsers(users)
})

form.addEventListener("submit", (e) => {
  e.preventDefault()
  let msg = e.target.elements.msg.value
  socket.emit("chatMessage", msg)
  // clear out values
  e.target.elements.msg.value = ""
})

const appendMessage = (message) => {
  const div = document.createElement("div")
  div.classList.add("message")
  div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`
  //   document.querySelector(".chat-messages").appendChild(div)
  chatMessages.appendChild(div)
}

const appendRoomName = (room) => {
  roomName.innerText = room
}

const appendUsers = (users) => {
  roomUsers.innerHTML = users
    .map((user) => `<li>${user.username}</li>`)
    .join("")
}
