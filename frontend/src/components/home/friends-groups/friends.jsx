import { useState } from "react"
import { useLocation, useNavigate } from "react-router"
import newAccessToken from "../../../functions/refreshToken"

function Friends({ user, friends, token, setToken, setChat }) {
  const navigate = useNavigate()
  const [addFriendName, setAddFriendName] = useState("")
  const [showAddFriend, setShowAddFriend] = useState(false)
  const showAddFriendFc = () => setShowAddFriend(!showAddFriend)

  async function sendFriendReq(e, value) {
    e.preventDefault()
    if (user.username === addFriendName) return
    try {
      const response = await fetch("http://localhost:3000/sendFriendRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${value}`,
        },
        body: JSON.stringify({ username: user.username, addFriendName }),
      })
      if (response.status === 403) {
        refreshToken(e)
        return
      }
      setAddFriendName("")
      if (!response.ok) {
        console.error("Error sending friend request")
      }
    } catch (error) {
      console.error("Network error:", error)
    }
  }
  async function refreshToken(e) {
    try {
      const accessToken = await newAccessToken()
      sendFriendReq(e, accessToken)
      setToken(accessToken)
    } catch (error) {
      console.error("Forbidden access, must log in again")
      navigate("/")
    }
  }

  return (
    <div className="friendsNames">
      {!showAddFriend && <button onClick={showAddFriendFc}>+</button>}
      {showAddFriend && <button onClick={showAddFriendFc}> &#8722;</button>}
      {showAddFriend && (
        <form onSubmit={(e) => sendFriendReq(e, token)}>
          <label htmlFor="addFriend"></label>
          <input
            type="text"
            id="addFriend"
            name="addFriend"
            autoComplete="off"
            placeholder="friend's username"
            value={addFriendName}
            onChange={(e) => setAddFriendName(e.target.value)}
            required
          />
          <button>Add friend</button>
        </form>
      )}
      {!showAddFriend && (
        <ul className="friends-group-container">
          {friends.map((friend, index) => (
            <li key={index} className="friends-groups-list" onClick={() => setChat(friend)}>
              {friend.friend}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
export default Friends
