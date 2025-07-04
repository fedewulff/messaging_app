import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router"
import newAccessToken from "../../functions/refreshToken"
import Navbar from "../Navbar"
import FriendsGroups from "./Friends-Groups"
import Chat from "./Chat"
import "../../css/home.css/Home.css"

function Home() {
  const location = useLocation()
  const [token, setToken] = useState("")
  const [error, setError] = useState(``)
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState()
  // console.log(user)
  // console.log(friends)
  // console.log(groups)
  //console.log(location)
  // const rendersNo = useRef(0)
  // console.log(location.state)
  // console.log(token)
  // useEffect(() => {
  //   rendersNo.current++
  //   console.log(`Component rendered ${rendersNo.current} times`)
  // })

  useEffect(() => {
    getUserData(token)
  }, [])

  if (token === "logout") {
    navigate("/")
    return
  }
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

  return (
    <div className="chatContainer">
      <Navbar userData={userData} />
      <div className="content">
        <FriendsGroups userData={userData} token={token} setToken={setToken} />
        <Chat />
      </div>
    </div>
  )
}

export default Home
