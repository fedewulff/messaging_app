const prisma = require("../prisma_client/prisma_client")

//PROFILE DATA
exports.getUserData = async (req, res) => {
  const userData = await prisma.user.findUnique({
    where: { id: req.user },
    include: { friends: true, groups: true },
  })
  console.log(userData)
  res.json({ userData: userData })
}
//SEND FRIEND REQUEST
exports.postFriendRequest = async (req, res) => {
  await prisma.friendReq.create({
    data: {
      fromUserId: req.user,
      fromUser: req.body.username,
      toUser: req.body.addFriendName,
    },
  })
  res.json({ msg: "Friend request sent" })
}
//GET FRIEND REQUESTS
exports.getFriendRequests = async (req, res) => {
  const friendReq = await prisma.friendReq.findMany({
    where: { toUser: req.params.toUser },
  })
  res.json({ friendReq })
}
//ADD FRIEND
exports.postFriend = async (req, res) => {
  await prisma.friends.createMany({
    data: [
      {
        userId: req.body.myId,
        friend: req.body.friendUsername,
        friendId: req.body.friendId,
      },
      {
        userId: req.body.friendId,
        friend: req.body.myUsername,
        friendId: req.body.myId,
      },
    ],
  })
  res.json({ msg: "friend added" })
}
//DELETE FRIEND
exports.denyFriend = async (req, res) => {
  await prisma.friendReq.delete({
    where: {
      fromUser_toUser: { fromUser: req.body.friendUsername, toUser: req.body.myUsername },
    },
  })
  res.json({ msg: "friend request deleted" })
}
