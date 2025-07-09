import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router"
import newAccessToken from "../../functions/refreshToken"

function FriendReq({ user, token, setToken }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [friendReqs, setFriendReqs] = useState([])
  const [searchForFriendReqs, setSearchForFriendReqs] = useState(true)

  useEffect(() => {
    searchFriendReq()
  }, [searchForFriendReqs])

  async function searchFriendReq() {
    try {
      const response = await fetch(`http://localhost:3000/getFriendRequests/${user.username}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      setFriendReqs(data.friendReq)
    } catch (error) {
      console.error(error)
    }
  }
  async function acceptFriend(token, myUsername, friendUsername, myId, friendId) {
    try {
      const response = await fetch("http://localhost:3000/addFriend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ myUsername, friendUsername, myId, friendId }),
      })
      if (response.status === 403) {
        console.error("403-Forbidden access, getting refresh token")
        refreshToken("addFriend", myUsername, friendUsername, myId, friendId)
        return
      }
      const data = await response.json()
      deleteFriendReq(token, myUsername, friendUsername)
      console.log(data)
    } catch (error) {
      console.error("Network error:", error)
    }
  }
  async function deleteFriendReq(token, myUsername, friendUsername) {
    try {
      const response = await fetch("http://localhost:3000/denyFriend", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ myUsername, friendUsername }),
      })
      if (response.status === 403) {
        console.error("403-Forbidden access, getting refresh token")
        refreshToken("denyFriend", myUsername, friendUsername)
        return
      }
      const data = await response.json()
      setSearchForFriendReqs(!searchForFriendReqs)
      console.log(data)
    } catch (error) {
      console.error("Network error:", error)
    }
  }
  async function refreshToken(value, myUsername, friendUsername, myId, friendId) {
    try {
      const accessToken = await newAccessToken()
      if (value === "addFriend") {
        acceptFriend(accessToken, myUsername, friendUsername, myId, friendId)
      }
      if (value === "denyFriend") {
        deleteFriendReq(accessToken, myUsername, friendUsername)
      }
      setToken(accessToken)
    } catch (error) {
      console.error("403-Forbidden access, must log in again")
      navigate("/")
    }
  }

  return (
    <div className="friendReq-container">
      <div>Friend requests:</div>
      {!friendReqs[0] && <div className="no-request">No friend requests</div>}
      <ul>
        {friendReqs.map((friendReq, index) => (
          <li key={index} className="friendsReq-list">
            <div>From: {friendReq.fromUser}</div>
            <div className="friendReq-groupReq-buttons">
              <button onClick={() => acceptFriend(token, user.username, friendReq.fromUser, user.id, friendReq.fromUserId)}>Accept</button>
              <button onClick={() => deleteFriendReq(token, user.username, friendReq.fromUser)}>Deny</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default FriendReq
