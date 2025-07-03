const bcrypt = require("bcrypt")
const prisma = require("../prisma_client/prisma_client")
const CustomError = require("../middleware/customError")
const jwt = require("jsonwebtoken")

//ADMIN PROFILE
module.exports.adminProfile = (req, res) => {
  return res.json({ user: req.user })
}

//LOG IN
module.exports.adminLogInPost = async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ message: "Username and password are required" })

  const user = await prisma.user.findUnique({
    where: { username: username },
  })
  if (!user) return res.status(400).json({ errorMessage: "Username does not exist" })

  const match = await bcrypt.compare(password, user.password)
  if (!match) return res.status(400).json({ errorMessage: "Incorrect password" })

  // generate tokens
  const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10s",
  })
  const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  })
  await prisma.user.update({
    where: { username: username },
    data: { refToken: refreshToken },
  })

  res.cookie("jwtRefToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  return res.status(200).json({ accessToken: accessToken })
}
