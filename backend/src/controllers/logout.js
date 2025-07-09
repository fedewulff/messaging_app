const prisma = require("../prisma_client/prisma_client")

module.exports.logout = async (req, res) => {
  if (!req.cookies.jwtRefToken) return res.sendStatus(204) //NO CONTENT
  const refreshToken = req.cookies.jwtRefToken

  const user = await prisma.user.updateMany({
    where: {
      refToken: refreshToken,
    },
    data: {
      refToken: null,
    },
  })

  delete req.headers["authorization"]
  res.clearCookie("jwtRefToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  })
  res.sendStatus(204)
}
