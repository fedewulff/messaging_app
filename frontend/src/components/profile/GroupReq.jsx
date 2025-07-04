import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router"
import newAccessToken from "../../functions/refreshToken"

function GroupReq(user, token, setToken) {
  const location = useLocation()
  const navigate = useNavigate()
  const [groupReqs, setGroupReqs] = useState([])
  const [searchForGroupReqs, setSearchForGroupReqs] = useState(true)

  useEffect(() => {
    searchGroupReq()
  }, [searchForGroupReqs])

  async function searchGroupReq() {
    try {
      const response = await fetch(`http://localhost:3000/getGroupRequests/${user.username}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      setGroupReqs(data.groupReq)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div>
      <div className="usernameProfile">Username: {user.username}</div>
      <ul>
        {groupReqs.map((groupReq, index) => (
          <li key={index} className="friendsReq-list">
            {groupReq.fromUser}
            {groupReq.groupName}
            <button onClick={() => acceptGroupReq(token, user.username, groupReq.fromUser, user.id, groupReq.fromUserId)}>Accept</button>
            <button onClick={() => deleteGroupReq(token, user.username, groupReq.fromUser)}>Deny</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default GroupReq
