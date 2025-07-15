import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import newAccessToken from "../../functions/refreshToken"
import "../../css/home.css/Chat.css"

function Chat({ chat, user, token, setToken }) {
  const navigate = useNavigate()
  const [msg, setMsg] = useState("")
  const [conversation, setConversation] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (chat.friend) {
      getFriendMessages(token, user.id, chat.friendId)
    }
    if (chat.group) {
      getGroupMessages(token, user.id, chat.group.id)
    }
  }, [chat])

  async function getFriendMessages(value, senderId, receiverId) {
    try {
      const response = await fetch(`http://localhost:3000/friendMessages/${senderId}/${receiverId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${value}`,
        },
      })
      if (response.status === 403) {
        refreshToken("getFriendMsgs", senderId, receiverId)
        return
      }
      const data = await response.json()
      setConversation(data.chatMsgs)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }
  async function getGroupMessages(value, senderId, receiverId) {
    try {
      const response = await fetch(`http://localhost:3000/groupMessages/${senderId}/${receiverId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${value}`,
        },
      })
      if (response.status === 403) {
        refreshToken("getGroupMsgs", senderId, receiverId)
        return
      }
      const data = await response.json()
      setConversation(data.chatMsgs)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }
  function sendMessage(e) {
    if (chat.friend) {
      sendFriendMessage(e, token, user.id, chat.friendId, msg)
    }
    if (chat.group) {
      sendGroupMessage(e, token, user.id, chat.group.id, msg, user.username)
    }
  }
  async function sendFriendMessage(e, value, senderId, receiverId, message) {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:3000/sendFriendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${value}`,
        },
        body: JSON.stringify({ senderId, receiverId, message }),
      })
      if (response.status === 403) {
        refreshToken("sendFriendMsg", e, senderId, receiverId, message)
        return
      }
      setMsg("")
    } catch (error) {
      console.error(error)
    }
  }
  async function sendGroupMessage(e, value, senderId, receiverId, message, senderUsername) {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:3000/sendGroupMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${value}`,
        },
        body: JSON.stringify({ senderId, senderUsername, receiverId, message }),
      })
      if (response.status === 403) {
        refreshToken("sendGroupMsg", e, senderId, receiverId, message, senderUsername)
        return
      }
      setMsg("")
    } catch (error) {
      console.error(error)
    }
  }
  async function refreshToken(value, val1, val2, val3, val4, val5) {
    try {
      const accessToken = await newAccessToken()
      setToken(accessToken)
      if (value === "getFriendMsgs") {
        getFriendMessages(accessToken, val1, val2)
      }
      if (value === "getGroupMsgs") {
        getGroupMessages(accessToken, val1, val2)
      }
      if (value === "sendFriendMsg") {
        sendFriendMessage(val1, accessToken, val2, val3, val4, val5)
      }
      if (value === "sendGroupMsg") {
        sendGroupMessage(val1, accessToken, val2, val3, val4, val5)
      }
    } catch (error) {
      console.error("403-Forbidden access, must log in again")
      navigate("/")
    }
  }

  return (
    <div className="chat">
      <div className="convContainer">
        {chat.friend && <div className="friendsName">{chat.friend}</div>}
        {chat.group && <div className="friendsName"> {chat.group.name}</div>}
        <div className="conv">
          <ul>
            {conversation.map((convMsg, index) => (
              <li key={index} className={convMsg.senderId === user.id ? "my-message" : "friend-message"}>
                {convMsg.senderId !== user.id && <div className="group-msg-sender">{convMsg.senderUsername}</div>}
                <div>{convMsg.message}</div>
              </li>
            ))}
          </ul>
        </div>
        <form action="message" onSubmit={(e) => sendMessage(e)}>
          <label htmlFor="message"></label>
          <textarea name="message" id="message" autoComplete="off" rows={3} value={msg} onChange={(e) => setMsg(e.target.value)}></textarea>
          <button type="submit">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>send-variant</title>
              <path d="M3 20V14L11 12L3 10V4L22 12Z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}

export default Chat
