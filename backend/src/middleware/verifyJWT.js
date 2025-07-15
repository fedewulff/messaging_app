const jwt = require("jsonwebtoken")

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  if (!authHeader) return res.sendStatus(401)
  const token = authHeader.split(" ")[1]
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403) //FORBIDDEN
    //console.log(user)
    req.user = user.id
    next()
  })
}

module.exports = authenticateToken
