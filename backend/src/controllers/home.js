const prisma = require("../prisma_client/prisma_client")

//PROFILE DATA
exports.getUserData = async (req, res) => {
  const userData = await prisma.user.findUnique({
    omit: {
      password: true,
    },
    where: { id: req.user },
    include: { friends: { select: { friend: true, friendId: true } }, groups: { select: { group: true } } },
  })
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
  res.sendStatus(204)
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
  const friendExists = await prisma.friends.findUnique({
    where: { userId_friendId: { userId: req.body.myId, friendId: req.body.friendId } },
  })
  if (friendExists) {
    res.json({ msg: "already friends" })
    return
  }

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
  res.sendStatus(204)
}
//DELETE FRIEND
exports.denyFriend = async (req, res) => {
  await prisma.friendReq.delete({
    where: {
      fromUser_toUser: { fromUser: req.body.friendUsername, toUser: req.body.myUsername },
    },
  })
  res.sendStatus(204)
}

//CREATE GROUP AND SEND INVITES
exports.createGroup = async (req, res) => {
  const group = await prisma.groups.create({
    data: {
      name: req.body.groupName,
      members: {
        create: { user: { connect: { id: req.body.myId } } },
      },
    },
  })

  for (let i = 0; i < req.body.friendsToInvite.length; i++) {
    await prisma.groupReq.create({
      data: {
        from: req.body.myUsername,
        groupId: group.id,
        groupName: group.name,
        to: req.body.friendsToInvite[i].friend,
      },
    })
  }

  res.sendStatus(204)
}
//GET GROUP INVITES
module.exports.getGroupRequests = async (req, res) => {
  const groupReq = await prisma.groupReq.findMany({
    where: { to: req.params.toUser },
  })
  res.json({ groupReq })
}
//ACCEPT GROUP INVITE
module.exports.acceptGroupInvite = async (req, res) => {
  await prisma.userGroups.create({
    data: {
      userId: req.body.myId,
      groupId: req.body.groupId,
    },
  })
  res.sendStatus(204)
}
//REJECT AND DELETE GROUP INVITE
module.exports.rejectGroupInvite = async (req, res) => {
  await prisma.groupReq.delete({ where: { id: req.body.groupReqId } })
  res.sendStatus(204)
}
