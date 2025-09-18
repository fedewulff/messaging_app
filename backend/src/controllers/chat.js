const prisma = require("../prisma_client/prisma_client")
const { io } = require("../server")

io.on("connection", (socket) => {
  let groupRoom
  console.log("connected:", socket.id, "to:", socket.user.id)
  socket.on("group name on connect", (data) => {
    socket.join(data.name)
    groupRoom = data.name
  })
  socket.on("join room", (data) => {
    socket.join(data)
    groupRoom = data
  })
  socket.on("friend message", async (data) => {
    try {
      await prisma.userFriendMessages.create({
        data: {
          message: data.message,
          senderId: data.senderId,
          receiverId: data.receiverId,
        },
      })
      const sockets = await io.fetchSockets()
      const friendSocket = sockets.filter((x) => x.user.id === data.receiverId)
      if (friendSocket[0]) {
        io.to([socket.id, friendSocket[0].id]).emit("friend message", { senderId: data.senderId, message: data.message })
      }
      if (!friendSocket[0]) {
        io.to(socket.id).emit("friend message", { senderId: data.senderId, message: data.message })
      }
    } catch (error) {
      console.error
      socket.emit("server error")
    }
  })
  socket.on("group message", async (data) => {
    try {
      await prisma.userGroupMessages.create({
        data: {
          message: data.message,
          senderId: data.senderId,
          senderUsername: data.senderUsername,
          receiverId: data.receiverId,
        },
      })
      io.to(groupRoom).emit("group message", { senderId: data.senderId, message: data.message, senderUsername: data.senderUsername })
    } catch (error) {
      console.log(error)
      socket.emit("server error")
    }
  })
  socket.on("disconnect", () => {
    console.log("disconnected:", socket.id, "to:", socket.user.id)
  })
})

module.exports.getFriendMessages = async (req, res) => {
  const chatMsgs = await prisma.userFriendMessages.findMany({
    where: {
      OR: [
        {
          senderId: req.params.senderId,
          receiverId: req.params.receiverId,
        },
        {
          senderId: req.params.receiverId,
          receiverId: req.params.senderId,
        },
      ],
    },
  })

  res.json({ chatMsgs })
}
module.exports.getGroupMessages = async (req, res) => {
  const chatMsgs = await prisma.userGroupMessages.findMany({
    where: {
      receiverId: req.params.receiverId,
    },
    select: {
      message: true,
      senderId: true,
      senderUsername: true,
    },
  })

  res.json({ chatMsgs })
}

//REPLACED BY SOCKET

// module.exports.sendFriendMessage = async (req, res) => {
//   await prisma.userFriendMessages.create({
//     data: {
//       message: req.body.message,
//       senderId: req.body.senderId,
//       receiverId: req.body.receiverId,
//     },
//   })
//   res.sendStatus(204)
// }

// module.exports.sendGroupMessage = async (req, res) => {
//   await prisma.userGroupMessages.create({
//     data: {
//       message: req.body.message,
//       senderId: req.body.senderId,
//       senderUsername: req.body.senderUsername,
//       receiverId: req.body.receiverId,
//     },
//   })
//   res.sendStatus(204)
// }
