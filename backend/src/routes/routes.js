const { Router } = require("express")
const routes = Router()
const signup = require("../controllers/signup")
const login = require("../controllers/login")
const home = require("../controllers/home")
const refreshToken = require("../controllers/refreshToken")
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
//ADD FRIEND
routes.delete("/denyFriend", authenticateToken, home.denyFriend)
//CREATE NEW ACCESS TOKEN
routes.get("/refreshToken", refreshToken.handleRefreshToken)

module.exports = routes
