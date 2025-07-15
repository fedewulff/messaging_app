import { useState } from "react"
import { useLocation, useNavigate } from "react-router"
import newAccessToken from "../../../functions/refreshToken"

function Groups({ user, friends, groups, token, setToken, setChat }) {
  const navigate = useNavigate()
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const newFriendsArray = friends.map((friend) => ({
    ...friend,
    isChecked: false,
  }))
  const [friendsCheckboxes, setFriendsCheckboxes] = useState(newFriendsArray)

  const showCreateGroupFc = () => setShowCreateGroup(!showCreateGroup)
  function handleCheckboxChange(id) {
    setFriendsCheckboxes((prevFriendsCheckboxes) =>
      prevFriendsCheckboxes.map((friendBox) => (friendBox.friendId === id ? { ...friendBox, isChecked: !friendBox.isChecked } : friendBox))
    )
  }
  const selectedFriends = friendsCheckboxes.filter((friendBox) => friendBox.isChecked)

  async function createGroup(e, token, myId, myUsername, groupName, friendsToInvite) {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:3000/createGroup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ myId, myUsername, groupName, friendsToInvite }),
      })
      if (response.status === 403) {
        refreshToken(e, myId, myUsername, groupName, friendsToInvite)
        return
      }
      setNewGroupName("")
      setFriendsCheckboxes((prevFriendsCheckboxes) => prevFriendsCheckboxes.map((friendBox) => ({ ...friendBox, isChecked: false })))
    } catch (error) {
      console.error("Network error:", error)
    }
  }
  async function refreshToken(e, myId, myUsername, groupName, friendsToInvite) {
    try {
      const accessToken = await newAccessToken()
      createGroup(e, accessToken, myId, myUsername, groupName, friendsToInvite)
      setToken(accessToken)
    } catch (error) {
      console.error("Forbidden access, must log in again")
      navigate("/")
    }
  }
  //   async function sendGroupReq(token) {
  //     try {
  //       const response = await fetch("http://localhost:3000/sendGroupRequest", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({ username: user.username, addFriendName }),
  //       })
  //       if (response.status === 403) {
  //         console.error("403-Forbidden access, getting refresh token")
  //         refreshToken(e, "friendReq")
  //         return
  //       }
  //       const data = await response.json()
  //       console.log(data)

  //       if (!response.ok) {
  //         console.error("error")
  //       }
  //     } catch (error) {
  //       console.error("Network error:", error)
  //     }
  //   }
  // function showData(groupChat) {
  //   setChat(groupChat)
  // }
  return (
    <div className="groupNames">
      {!showCreateGroup && <button onClick={showCreateGroupFc}>+</button>}
      {showCreateGroup && <button onClick={showCreateGroupFc}> &#8722;</button>}
      {showCreateGroup && (
        <form onSubmit={(e) => createGroup(e, token, user.id, user.username, newGroupName, selectedFriends)} className="addGroup-form">
          <label htmlFor="addGroup"></label>
          <input
            type="text"
            id="addGroup"
            name="addGroup"
            autoComplete="off"
            value={newGroupName}
            placeholder="Group name"
            onChange={(e) => setNewGroupName(e.target.value)}
            required
          />
          {friends[0] && <div className="invite-friends">Invite friends:</div>}
          <div className="friends-list-to-add">
            {friendsCheckboxes.map((friendBox, index) => (
              <div key={index} className="checkbox-container ">
                <input
                  type="checkbox"
                  id={friendBox.friendId}
                  name={friendBox.friend}
                  checked={friendBox.isChecked}
                  onChange={() => handleCheckboxChange(friendBox.friendId)}
                />
                <span className="checkmark"></span>
                <label htmlFor={friendBox.friendId}>{friendBox.friend}</label>
              </div>
            ))}
          </div>
          <button>Create group</button>
        </form>
      )}
      {!showCreateGroup && (
        <ul className="friends-group-container">
          {groups.map((group, index) => (
            <li key={index} className="friends-groups-list" onClick={() => setChat(group)}>
              {group.group.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
export default Groups
