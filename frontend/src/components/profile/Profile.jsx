import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router"
import newAccessToken from "../../functions/refreshToken"
import FriendReq from "./FriendReq"
import GroupReq from "./GroupReq"
import Navbar from "../Navbar"
import ErrorRequest from "../ErrorRequest"
import "../../css/Profile.css"

function Profile() {
  const navigate = useNavigate()
  const [token, setToken] = useState()
  const [userData, setUserData] = useState()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [status, setStatus] = useState()

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
      setStatus(response.status)
      const data = await response.json()
      setUserData(data.userData)
    } catch (error) {
      console.error(error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }
  async function refreshToken(value) {
    try {
      const accessToken = await newAccessToken()
      setToken(accessToken)
      getUserData(accessToken)
    } catch (error) {
      console.error("Forbidden access, must log in again")
      navigate("/")
    }
  }

  if (error && !userData) return <ErrorRequest status={status} />
  if (loading) return <div className="loading">Loading...</div>
  if (!userData || !token) return
  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="username-profile">
          <div>Username: </div>
          <div>{userData.username}</div>
        </div>
        <FriendReq user={userData} token={token} setToken={setToken} />
        <GroupReq user={userData} token={token} setToken={setToken} />
      </div>
    </>
  )
}
export default Profile
