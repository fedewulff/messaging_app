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
routes.post("/signup", signup.adminSignUpPost)
//LOGIN
routes.post("/login", login.adminLogInPost)
//GET USER DATA
routes.get("/user", authenticateToken, home.getUserData)
//SEND FRIEND REQUEST
routes.post("/sendFriendRequest", authenticateToken, home.postFriendRequest)
//GET FRIEND REQUEST
routes.get("/getFriendRequests/:toUser", home.getFriendRequests)
//ADD FRIEND
routes.post("/addFriend", authenticateToken, home.postFriend)
//DELETE FRIEND REQ
routes.delete("/denyFriend", authenticateToken, home.denyFriend)
//CREATE NEW ACCESS TOKEN
routes.get("/refreshToken", refreshToken.handleRefreshToken)
//CREATE GROUP AND SEND INVITES
routes.post("/createGroup", authenticateToken, home.createGroup)
//SEND GROUP REQUEST
//routes.post("/sendGroupRequest", authenticateToken, home.postGroupRequest)
//GET GROUP REQUEST
routes.get("/getGroupRequests/:toUser", authenticateToken, home.getGroupRequests)
//ACCEPT GROUP INVITE
routes.post("/acceptGroupInvite", authenticateToken, home.acceptGroupInvite)
//REJECT AND DELETE GROUP INVITE
routes.delete("/rejectGroupInvite", authenticateToken, home.rejectGroupInvite)
//GET MESSAGES
routes.get("/chatMessages/:senderId/:receiverId", authenticateToken, chat.getChatMessages)
//SEND MESSAGE
routes.post("/sendChatMessage", authenticateToken, chat.sendChatMessage)
//LOGOUT
routes.put("/logout", logout.logout)

module.exports = routes
