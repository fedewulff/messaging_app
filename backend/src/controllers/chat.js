const prisma = require("../prisma_client/prisma_client")

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
module.exports.sendFriendMessage = async (req, res) => {
  await prisma.userFriendMessages.create({
    data: {
      message: req.body.message,
      senderId: req.body.senderId,
      receiverId: req.body.receiverId,
    },
  })
  res.sendStatus(204)
}
module.exports.sendGroupMessage = async (req, res) => {
  await prisma.userGroupMessages.create({
    data: {
      message: req.body.message,
      senderId: req.body.senderId,
      senderUsername: req.body.senderUsername,
      receiverId: req.body.receiverId,
    },
  })
  res.sendStatus(204)
}
