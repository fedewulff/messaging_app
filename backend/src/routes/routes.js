const { Router } = require("express")
const routes = Router()
const signup = require("../controllers/signup")
const login = require("../controllers/login")
const home = require("../controllers/home")
const refreshToken = require("../controllers/refreshToken")
const logout = require("../controllers/logout")
const chat = require("../controllers/chat")
const authenticateToken = require("../middleware/verifyJWT")

//SIGNUP
routes.post("/signup", signup.signup)
//LOGIN
routes.post("/login", login.login)
//GET USER DATA
routes.get("/user", authenticateToken, home.getUserData)
//SEND FRIEND REQUEST
routes.post("/sendFriendRequest", authenticateToken, home.postFriendRequest)
//GET FRIEND REQUEST
routes.get("/getFriendRequests/:toUser", authenticateToken, home.getFriendRequests)
//ADD FRIEND
routes.post("/addFriend", authenticateToken, home.postFriend)
//DELETE FRIEND REQ
routes.delete("/denyFriend", authenticateToken, home.denyFriend)
//CREATE NEW ACCESS TOKEN
routes.get("/refreshToken", refreshToken.handleRefreshToken)
//CREATE GROUP AND SEND INVITES
routes.post("/createGroup", authenticateToken, home.createGroup)
//GET GROUP REQUEST
routes.get("/getGroupRequests/:toUser", authenticateToken, home.getGroupRequests)
//ACCEPT GROUP INVITE
routes.post("/acceptGroupInvite", authenticateToken, home.acceptGroupInvite)
//REJECT AND DELETE GROUP INVITE
routes.delete("/rejectGroupInvite", authenticateToken, home.rejectGroupInvite)
//GET FRIEND MESSAGES
routes.get("/friendMessages/:senderId/:receiverId", authenticateToken, chat.getFriendMessages)
//GET GROUP MESSAGES
routes.get("/groupMessages/:senderId/:receiverId", authenticateToken, chat.getGroupMessages)
//SEND MESSAGE TO FRIEND
//routes.post("/sendFriendMessage", authenticateToken, chat.sendFriendMessage)
//SEND MESSAGE TO GROUP
//routes.post("/sendGroupMessage", authenticateToken, chat.sendGroupMessage)
//LOGOUT
routes.put("/logout", logout.logout)

module.exports = routes
