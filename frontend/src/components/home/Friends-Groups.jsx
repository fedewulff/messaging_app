import { useState } from "react"
import { useLocation, useNavigate } from "react-router"
import newAccessToken from "../../functions/refreshToken"
import Friends from "./friends-groups/friends"
import Groups from "./friends-groups/groups"
import "../../css/home.css/friends-groups.css"

function FriendsGroups({ userData, token, setToken, setChat, showFriends, setShowFriends }) {
  const [user, setUser] = useState()
  const [friends, setFriends] = useState([])
  const [groups, setGroups] = useState([])

  if (!user) {
    setUser({ id: userData.id, username: userData.username })
    setFriends(userData.friends)
    setGroups(userData.groups)
  }

  const [showFriendsList, setShowFriendsList] = useState(true)

  const showFriendsListFc = () => setShowFriendsList(!showFriendsList)
  const showFriendsCont = () => setShowFriends(!showFriends)

  return (
    <div className={showFriends ? "friendsContainer active" : "friendsContainer"}>
      <button className="closeFriendsContainer" onClick={showFriendsCont}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>arrow-left-bold</title>
          <path d="M20,9V15H12V19.84L4.16,12L12,4.16V9H20Z" />
        </svg>
      </button>
      <div className="friendsTitle">
        <button onClick={showFriendsListFc} className={showFriendsList ? "selected" : "notselected"}>
          Friends
        </button>
        <button onClick={showFriendsListFc} className={showFriendsList ? "notselected" : "selected"}>
          Groups
        </button>
      </div>
      {showFriendsList && <Friends user={user} friends={friends} token={token} setToken={setToken} setChat={setChat} />}
      {!showFriendsList && <Groups user={user} friends={friends} groups={groups} token={token} setToken={setToken} setChat={setChat} />}
    </div>
  )
}
export default FriendsGroups
