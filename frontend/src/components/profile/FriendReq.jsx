import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router"
import newAccessToken from "../../functions/refreshToken"

function FriendReq({ user, token, setToken }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [friendReqs, setFriendReqs] = useState([])
  const [searchForFriendReqs, setSearchForFriendReqs] = useState(true)

  useEffect(() => {
    searchFriendReq(token)
  }, [searchForFriendReqs])

  async function searchFriendReq(accToken) {
    try {
      const response = await fetch(`http://localhost:3000/getFriendRequests/${user.username}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accToken}`,
        },
      })
      if (response.status === 403) {
        refreshToken("searchFriendReq")
        return
      }
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
        refreshToken("addFriend", myUsername, friendUsername, myId, friendId)
        return
      }
      deleteFriendReq(token, myUsername, friendUsername)
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
        refreshToken("denyFriend", myUsername, friendUsername)
        return
      }
      setSearchForFriendReqs(!searchForFriendReqs)
    } catch (error) {
      console.error("Network error:", error)
    }
  }
  async function refreshToken(value, myUsername, friendUsername, myId, friendId) {
    try {
      const accessToken = await newAccessToken()
      if (value === "searchFriendReq") {
        searchFriendReq(accessToken)
      }
      if (value === "addFriend") {
        acceptFriend(accessToken, myUsername, friendUsername, myId, friendId)
      }
      if (value === "denyFriend") {
        deleteFriendReq(accessToken, myUsername, friendUsername)
      }
      setToken(accessToken)
    } catch (error) {
      console.error("Forbidden access, must log in again")
      navigate("/")
    }
  }

  return (
    <div className="friendReq-container">
      <div className="friend-group-requests">Friend requests:</div>
      {!friendReqs[0] && <div className="no-request">No friend requests</div>}
      <ul>
        {friendReqs.map((friendReq, index) => (
          <li key={index} className="friendsReq-list">
            <div className="friendsReq-list-name">From: {friendReq.fromUser}</div>
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
