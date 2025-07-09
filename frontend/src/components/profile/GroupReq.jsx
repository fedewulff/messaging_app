import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router"
import newAccessToken from "../../functions/refreshToken"

function GroupReq({ user, token, setToken }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [groupReqs, setGroupReqs] = useState([])
  const [searchForGroupReqs, setSearchForGroupReqs] = useState(true)

  useEffect(() => {
    searchGroupReq()
  }, [searchForGroupReqs])

  async function searchGroupReq(token) {
    try {
      const response = await fetch(`http://localhost:3000/getGroupRequests/${user.username}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (response.status === 403) {
        console.error("403-Forbidden access, getting refresh token")
        refreshToken("searchGroupReq", token)
        return
      }
      setGroupReqs(data.groupReq)
    } catch (error) {
      console.error(error)
    }
  }
  async function acceptGroupReq(token, myId, groupId, groupReqId) {
    console.log(groupReqId)
    try {
      const response = await fetch("http://localhost:3000/acceptGroupInvite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ myId, groupId }),
      })
      if (response.status === 403) {
        console.error("403-Forbidden access, getting refresh token")
        refreshToken("acceptGroup", myId, groupId)
        return
      }
      const data = await response.json()
      deleteGroupReq(token, groupReqId)
    } catch (error) {
      console.error("Network error:", error)
    }
  }
  async function deleteGroupReq(token, groupReqId) {
    console.log(groupReqId)
    try {
      const response = await fetch("http://localhost:3000/rejectGroupInvite", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ groupReqId }),
      })
      if (response.status === 403) {
        console.error("403-Forbidden access, getting refresh token")
        refreshToken("rejectGroup", groupReqId)
        return
      }
      const data = await response.json()
      setSearchForGroupReqs(!searchForGroupReqs)
      console.log(data)
    } catch (error) {
      console.error("Network error:", error)
    }
  }
  async function refreshToken(value, val1, val2) {
    try {
      const accessToken = await newAccessToken()

      if (value === "searchGroupReq") {
        searchGroupReq(accessToken)
      }
      if (value === "acceptGroup") {
        acceptGroupReq(accessToken, val1, val2)
      }
      if (value === "rejectGroup") {
        deleteGroupReq(accessToken, val1)
      }

      setToken(accessToken)
    } catch (error) {
      console.error("403-Forbidden access, must log in again")
      navigate("/")
    }
  }
  return (
    <div className="groupRec-container">
      <div>Group requests:</div>
      {!groupReqs[0] && <div className="no-request">No group requests</div>}
      <ul>
        {groupReqs.map((groupReq, index) => (
          <li key={index} className="groupsReq-list">
            <div>
              <div>From: {groupReq.from}</div>
              <div>Group name: {groupReq.groupName}</div>
            </div>

            <div className="friendReq-groupReq-buttons">
              <button onClick={() => acceptGroupReq(token, user.id, groupReq.groupId, groupReq.id)}>Accept</button>
              <button onClick={() => deleteGroupReq(token, groupReq.id)}>Deny</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default GroupReq
