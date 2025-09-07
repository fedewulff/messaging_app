import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router"
import newAccessToken from "../../functions/refreshToken"
import FriendReq from "./FriendReq"
import GroupReq from "./GroupReq"
import ErrorRequest from "../ErrorRequest"
import "../../css/Profile.css"

function Profile({ token, setToken }) {
  const navigate = useNavigate()
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
    } catch (error) {
      console.error("Forbidden access, must log in again")
      navigate("/")
    }
  }

  if (error) return <ErrorRequest status={status} />
  if (loading) return <div className="loading">Loading...</div>
  if (!userData || !token) return
  return (
    <>
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
