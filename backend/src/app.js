require("dotenv").config()
const express = require("express")
const routes = require("./routes/routes")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")

const { app, server, io } = require("./server")

app.use(express.json())
app.use(cookieParser())
//app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))

io.use((socket, next) => {
  const token = socket.handshake.auth.token
  if (!token) {
    return next(new Error("Authentication error: No token provided."))
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    socket.user = decoded // Attach user data to the socket object
    next()
  } catch (error) {
    next(new Error("Invalid token"))
  }
})

app.use("/", routes)

const PORT = process.env.PORT || 6000
server.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`))
