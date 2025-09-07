import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router"
import newAccessToken from "../../functions/refreshToken"
import Navbar from "../Navbar"
import FriendsGroups from "./Friends-Groups"
import Chat from "./Chat"
import ErrorRequest from "../ErrorRequest"
import "../../css/home.css/Home.css"

function Home({ token, setToken, showFriends, setShowFriends }) {
  const location = useLocation()
  const navigate = useNavigate()

  const [error, setError] = useState(false)
  const [status, setStatus] = useState()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState()
  const [chat, setChat] = useState({})

  useEffect(() => {
    getUserData(token)
  }, [])

  async function getUserData(value) {
    try {
      const response = await fetch("http://localhost:3000/user", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${value}`,
        },
      })

      if (response.status === 403) {
        refreshToken()
        return
      }
      if (!response.ok) {
        setStatus(response.status)
        throw new Error(`${response.statusText} - Error code:${response.status} - ${response.url}`)
      }
      const data = await response.json()
      setUserData(data.userData)
    } catch (error) {
      console.error(error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }
  async function refreshToken() {
    try {
      const accessToken = await newAccessToken()
      setToken(accessToken)
      getUserData(accessToken)
      if (location.state) {
        location.state = null
      }
    } catch (error) {
      console.error("Forbidden access, must log in again")
      navigate("/")
    }
  }
  if (error) return <ErrorRequest status={status} />
  if (loading) return <div className="loading">Loading...</div>
  if (!userData || !token) return

  return (
    <div className="chatContainer">
      <div className="content">
        <FriendsGroups
          userData={userData}
          token={token}
          setToken={setToken}
          setChat={setChat}
          showFriends={showFriends}
          setShowFriends={setShowFriends}
        />
        <Chat chat={chat} user={{ id: userData.id, username: userData.username }} token={token} setToken={setToken} />
      </div>
    </div>
  )
}

export default Home
