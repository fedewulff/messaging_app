const prisma = require("../prisma_client/prisma_client")
const jwt = require("jsonwebtoken")

module.exports.handleRefreshToken = async (req, res) => {
  if (!req.cookies.jwtRefToken) return res.sendStatus(401)
  const refreshToken = req.cookies.jwtRefToken
  const userExists = prisma.user.findUnique({
    where: {
      refreshToken: refreshToken,
    },
  })
  if (!userExists) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403) //FORBIDDEN
    const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "10s",
    })
    //console.log(accessToken)
    res.json({ accessToken: accessToken })
  })
}
