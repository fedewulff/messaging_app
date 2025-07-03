import { useState, useEffect, useRef } from "react"
import { useLocation } from "react-router"
import FriendReq from "./FriendReq"
import GroupReq from "./GroupReq"

import "../../css/Profile.css"

function Profile() {
  const location = useLocation()
  const [token, setToken] = useState()
  const user = location.state.user

  if (location.state && !token) {
    setToken(location.state.token || 123)
  }

  return (
    <>
      <FriendReq user={user} token={token} setToken={setToken} />
    </>
  )
}
export default Profile
