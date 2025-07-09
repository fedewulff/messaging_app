import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router"
import newAccessToken from "../../functions/refreshToken"
import Navbar from "../Navbar"
import FriendsGroups from "./Friends-Groups"
import Chat from "./Chat"
import "../../css/home.css/Home.css"

function Home() {
  const location = useLocation()
  const navigate = useNavigate()
  const [token, setToken] = useState("")
  const [error, setError] = useState(``)
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState()
  const [chat, setChat] = useState({})

  useEffect(() => {
    getUserData(token)
  }, [])

  if (location.state && !token) {
    setToken(location.state.token)
    return
  }
  if (!location.state && !token) {
    refreshToken()
    return
  }
  async function getUserData(value) {
    try {
      const response = await fetch("http://localhost:3000/user", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${value}`,
        },
      })
      if (response.status === 403) {
        console.error("403-Forbidden access, getting refresh token")
        refreshToken()
        return
      }
      const data = await response.json()
      setUserData(data.userData)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }
  async function refreshToken() {
    try {
      const accessToken = await newAccessToken()
      setToken(accessToken)
      getUserData(accessToken)
    } catch (error) {
      console.error("403-Forbidden access, must log in again")
      navigate("/")
    }
  }
  if (!userData || !token) return

  return (
    <div className="chatContainer">
      <Navbar userData={userData} setToken={setToken} />
      <div className="content">
        <FriendsGroups userData={userData} token={token} setToken={setToken} setChat={setChat} />
        <Chat chat={chat} userId={userData.id} token={token} setToken={setToken} />
      </div>
    </div>
  )
}

export default Home
