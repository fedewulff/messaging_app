import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router"
import FriendReq from "./FriendReq"
import GroupReq from "./GroupReq"
import Navbar from "../Navbar"
import "../../css/Profile.css"

function Profile() {
  const location = useLocation()
  const navigate = useNavigate()
  const [token, setToken] = useState()
  const [user, setUser] = useState({})

  if (location.state && !token) {
    setToken(location.state.token || 123)
    setUser(location.state.userData)
  }

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="username-profile">
          <div>Username: </div>
          <div>{user.username}</div>
        </div>
        <FriendReq user={user} token={token} setToken={setToken} />
        <GroupReq user={user} token={token} setToken={setToken} />
      </div>
    </>
  )
}
export default Profile
