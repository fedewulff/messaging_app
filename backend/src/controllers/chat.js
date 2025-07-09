const prisma = require("../prisma_client/prisma_client")

module.exports.getChatMessages = async (req, res) => {
  // console.log(req.params)
  const chatMsgs = await prisma.userMessages.findMany({
    where: {
      OR: [
        {
          senderId: req.params.senderId,
          receiverId: req.params.receiverId,
        },
        {
          senderId: req.params.senderId,
          receiverId: req.params.receiverId,
        },
      ],
    },
  })
  res.json({ chatMsgs })
}
module.exports.sendChatMessage = async (req, res) => {
  const message = await prisma.userMessages.create({
    data: {
      message: req.body.message,
      senderId: req.body.senderId,
      receiverId: req.body.receiverId,
    },
  })
  res.json({ message })
}
