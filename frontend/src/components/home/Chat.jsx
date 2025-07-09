import { useEffect, useState } from "react"
import newAccessToken from "../../functions/refreshToken"
import "../../css/home.css/Chat.css"

function Chat({ chat, userId, token, setToken }) {
  const [msg, setMsg] = useState("")
  const [conversation, setConversation] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (chat.friend) {
      getChatMessages(token, userId, chat.friendId)
    }
    if (chat.group) {
      getChatMessages(token, userId, chat.group.id)
    }
  }, [chat])

  async function getChatMessages(value, senderId, receiverId) {
    try {
      const response = await fetch(`http://localhost:3000/chatMessages/${senderId}/${receiverId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${value}`,
        },
      })
      if (response.status === 403) {
        console.error("403-Forbidden access, getting refresh token")
        refreshToken("getMsgs", senderId, receiverId)
        return
      }
      const data = await response.json()
      setConversation(data.chatMsgs)
      console.log(data.chatMsgs)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }
  function sendMessage(e) {
    if (chat.friend) {
      sendChatMessage(e, token, userId, chat.friendId, msg)
    }
    if (chat.group) {
      sendChatMessage(e, token, userId, chat.group.id, msg)
    }
  }
  async function sendChatMessage(e, value, senderId, receiverId, message) {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:3000/sendChatMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${value}`,
        },
        body: JSON.stringify({ senderId, receiverId, message }),
      })
      if (response.status === 403) {
        console.error("403-Forbidden access, getting refresh token")
        refreshToken("sendMsg", e, senderId, receiverId, message)
        return
      }
      const data = await response.json()
      console.log(data)
      setMsg("")
    } catch (error) {
      console.error(error)
    }
  }
  async function refreshToken(value, val1, val2, val3, val4) {
    try {
      const accessToken = await newAccessToken()
      setToken(accessToken)
      if (value === "getMsgs") {
        console.log(999)
        getChatMessages(accessToken, val1, val2)
      }
      if (value === "sendMsg") {
        sendChatMessage(val1, accessToken, val2, val3, val4)
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
              <li key={index} className={convMsg.senderId === userId ? "my-message" : "friend-message"}>
                {convMsg.message}
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
