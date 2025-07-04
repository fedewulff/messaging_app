import { useState } from "react"
import { useLocation, useNavigate } from "react-router"
import newAccessToken from "../../functions/refreshToken"
import Friends from "./friends-groups/friends"
import Groups from "./friends-groups/groups"
import "../../css/home.css/Friends.css"

function FriendsGroups({ userData, token, setToken }) {
  const [user, setUser] = useState()
  const [friends, setFriends] = useState([])
  const [groups, setGroups] = useState([])

  if (userData && !friends[0] && !groups[0]) {
    setUser({ id: userData.id, username: userData.username })
    setFriends(userData.friends)
    setGroups(userData.groups)
  }

  const [showFriendsList, setShowFriendsList] = useState(true)
  //console.log(user)

  const showFriendsListFc = () => setShowFriendsList(!showFriendsList)

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
      {showFriendsList && <Friends user={user} friends={friends} token={token} setToken={setToken} />}
      {!showFriendsList && <Groups user={user} friends={friends} groups={groups} token={token} setToken={setToken} />}
    </div>
  )
}
export default FriendsGroups
