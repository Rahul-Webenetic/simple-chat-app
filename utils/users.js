const userlist = []

const userJoin = (id, username, room) => {
  const user = { id, username, room }
  userlist.push(user)
  return user
}

const getCurrentUser = (id) => {
  return userlist.find((user) => user.id === id)
}

const userLeave = (id) => {
  const index = userlist.findIndex((user) => user.id === id)
  if (index !== -1) {
    return userlist.splice(index, 1)[0]
  }
  // return
}

const getRoomUsers = (room) => {
  return userlist.filter((user) => user.room === room)
}

module.exports = { userJoin, getCurrentUser, userLeave, getRoomUsers }
