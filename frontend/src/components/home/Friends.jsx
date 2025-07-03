import { useState } from "react"
import { useLocation, useNavigate } from "react-router"
import newAccessToken from "../../functions/refreshToken"
import "../../css/home.css/Friends.css"

function Friends({ user, friends, groups, token, setToken }) {
  const navigate = useNavigate()
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [addFriendName, setAddFriendName] = useState("")
  const [showFriendsList, setShowFriendsList] = useState(true)

  const showAddFriendFc = () => setShowAddFriend(!showAddFriend)
  const showFriendsListFc = () => setShowFriendsList(!showFriendsList)

  async function sendFriendReq(e, value) {
    e.preventDefault()
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
        console.error("403-Forbidden access, getting refresh token")
        refreshToken(e, "friendReq")
        return
      }
      const data = await response.json()
      console.log(data)

      if (!response.ok) {
        console.error("error")
      }
    } catch (error) {
      console.error("Network error:", error)
    }
  }
  async function refreshToken(e, value) {
    try {
      const accessToken = await newAccessToken()
      console.log(accessToken)
      if (value === "friendReq") {
        sendFriendReq(e, accessToken)
      }
      setToken(accessToken)
    } catch (error) {
      console.error("403-Forbidden access, must log in again")
      navigate("/")
    }
  }

  return (
    <div className="friendsContainer">
      <div className="friendsTitle">
        <button onClick={showFriendsListFc} className={showFriendsList ? "selected" : "notselected"}>
          Friends
        </button>
        <button onClick={showFriendsListFc} className={showFriendsList ? "notselected" : "selected"}>
          Groups
        </button>
      </div>
      {showFriendsList && (
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
                value={addFriendName}
                onChange={(e) => setAddFriendName(e.target.value)}
                required
              />
              <button>Add friend</button>
            </form>
          )}
          <ul>
            {friends.map((friend, index) => (
              <li key={index} className="friends-groups-list">
                {friend.friend}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!showFriendsList && (
        <div className="groupNames">
          {!showAddFriend && <button onClick={showAddFriendFc}>+</button>}
          {showAddFriend && <button onClick={showAddFriendFc}> &#8722;</button>}
          {showAddFriend && (
            <form>
              <label htmlFor="addGroup"></label>
              <input
                type="text"
                id="addGroup"
                name="addGroup"
                autoComplete="off"
                value={addFriendName}
                placeholder="Group name"
                onChange={(e) => setAddFriendName(e.target.value)}
                required
              />
              <button>Create group</button>
            </form>
          )}
          <ul>
            {groups.map((group, index) => (
              <li key={index} className="friends-groups-list">
                {group.msg}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
export default Friends
