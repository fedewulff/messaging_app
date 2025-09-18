import { useState, useEffect } from "react"
import { useParams } from "react-router"
import { useLocation, useNavigate } from "react-router"
import "../../css/index.css"
import newAccessToken from "../../functions/refreshToken"
import Navbar from "../Navbar"
import Home from "../home/Home"
import Profile from "../profile/Profile"
import ErrorURL from "../ErrorURL"
import { socket } from "../../../socket/socket"

function App() {
  const [token, setToken] = useState("")
  const [showFriends, setShowFriends] = useState(false)
  const { page } = useParams()
  const location = useLocation()
  console.log(token)

  socket.once("connect_error", (err) => {
    if (err.message === "Invalid token") refreshToken()
    console.error(err.message)
  })
  useEffect(() => {
    if (token) {
      socket.auth.token = token
      socket.on("reconnect_attempt", () => {
        console.log(1)
      })
      socket.disconnect().connect() // To force a reconnection with the new token
    }
  }, [token])
  useEffect(() => {
    console.log(12345)
    const handlePageShow = (event) => {
      console.log("pageshow event fired!", event)
      if (event.persisted) {
        console.log("Page was restored from the back/forward cache.")
        socket.connect()
      } else {
        console.log("Page was loaded or navigated to normally.")
      }
    }

    window.addEventListener("pageshow", handlePageShow)

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("pageshow", handlePageShow)
    }
  }, [])

  if (location.state && !token) {
    setToken(location.state.token)
    return
  }
  async function refreshToken() {
    try {
      const accessToken = await newAccessToken()
      setToken(accessToken)
    } catch (error) {
      navigate("/")
    }
  }

  return (
    <div className="app">
      <Navbar showFriends={showFriends} setShowFriends={setShowFriends} />
      {page === "home" ? (
        <Home token={token} setToken={setToken} showFriends={showFriends} setShowFriends={setShowFriends} />
      ) : page === "profile" ? (
        <Profile token={token} setToken={setToken} />
      ) : (
        <ErrorURL />
      )}
    </div>
  )
}

export default App
