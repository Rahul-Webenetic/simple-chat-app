const socket = io()
const form = document.getElementById("chat-form")
const chatMessages = document.querySelector(".chat-messages")

socket.on("message", (message) => {
  appendMessage(message)
  chatMessages.scrollTop = chatMessages.scrollHeight
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
  div.innerHTML = `<p class="meta">Brad <span>9:12pm</span></p>
  <p class="text">
    ${message}
  </p>`
  //   document.querySelector(".chat-messages").appendChild(div)
  chatMessages.appendChild(div)
}
