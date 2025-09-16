import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router"
import { socket } from "../../../socket/socket"
import newAccessToken from "../../functions/refreshToken"
import "../../css/home.css/Chat.css"
const URL = import.meta.env.VITE_BACKEND_URL

function Chat({ chat, user, token, setToken }) {
  const navigate = useNavigate()
  const messagesEndRef = useRef(null)
  const [msg, setMsg] = useState("")
  const [conversation, setConversation] = useState([])
  const [error, setError] = useState(false)
  const myStateRef = useRef(chat)

  useEffect(() => {
    myStateRef.current = chat
    if (chat.friend) {
      getFriendMessages(token, user.id, chat.friendId)
    }
    if (chat.group) {
      socket.emit("join room", chat.group.name)
      getGroupMessages(token, user.id, chat.group.id)
    }
  }, [chat])
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView() // Scroll into view
    }
  }, [conversation])
  useEffect(() => {
    socket.on("connect", () => {
      console.log("disconnected from socket")
      if (myStateRef.current.group) socket.emit("group name on connect", myStateRef.current.group) //para unir al group room en socket

      socket.once("disconnect", () => console.log("disconnected from socket"))
    })
    socket.on("friend message", (msg) => {
      if (myStateRef.current.friend) setConversation((prevConversation) => [...prevConversation, msg])
    })
    socket.on("group message", (msg) => {
      setConversation((prevConversation) => [...prevConversation, msg])
    })
    socket.on("server error", () => setError(true))

    return () => {
      socket.off("connect")
      socket.off("disconnect")
      socket.off("new message")
      socket.off("friend message")
    }
  }, [])
  async function getFriendMessages(value, senderId, receiverId) {
    try {
      const response = await fetch(`${URL}/friendMessages/${senderId}/${receiverId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${value}`,
        },
      })
      if (response.status === 403) {
        refreshToken("getFriendMsgs", senderId, receiverId)
        return
      }
      if (!response.ok) {
        throw new Error(`${response.statusText} - Error code:${response.status} - ${response.url}`)
      }

      const data = await response.json()
      if (error) setError(false)
      setConversation(data.chatMsgs)
    } catch (error) {
      console.error(error)
      setError(true)
    }
  }
  async function getGroupMessages(value, senderId, receiverId) {
    try {
      const response = await fetch(`${URL}/groupMessages/${senderId}/${receiverId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${value}`,
        },
      })
      if (response.status === 403) {
        refreshToken("getGroupMsgs", senderId, receiverId)
        return
      }
      if (!response.ok) {
        throw new Error(`${response.statusText} - Error code:${response.status} - ${response.url}`)
      }
      const data = await response.json()
      if (error) setError(false)
      setConversation(data.chatMsgs)
    } catch (error) {
      console.error(error)
      setError(true)
    }
  }
  function sendMessage(e) {
    e.preventDefault()
    if (chat.friend) {
      sendFriendMessage(e, token, user.id, chat.friendId, msg)
    }
    if (chat.group) {
      sendGroupMessage(e, token, user.id, chat.group.id, msg, user.username)
    }
  }
  async function sendFriendMessage(e, value, senderId, receiverId, message) {
    socket.emit("friend message", { value, senderId, receiverId, message })
    setMsg("")
    // try {
    //   const response = await fetch(`http://localhost:3000/sendFriendMessage`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${value}`,
    //     },
    //     body: JSON.stringify({ senderId, receiverId, message }),
    //   })
    //   if (response.status === 403) {
    //     refreshToken("sendFriendMsg", e, senderId, receiverId, message)
    //     return
    //   }
    //   setMsg("")
    // } catch (error) {
    //   console.error(error)
    // }
  }
  async function sendGroupMessage(e, value, senderId, receiverId, message, senderUsername) {
    socket.emit("group message", { value, senderId, receiverId, message, senderUsername })
    setMsg("")
    //e.preventDefault()
    // try {
    //   const response = await fetch(`http://localhost:3000/sendGroupMessage`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${value}`,
    //     },
    //     body: JSON.stringify({ senderId, senderUsername, receiverId, message }),
    //   })
    //   if (response.status === 403) {
    //     refreshToken("sendGroupMsg", e, senderId, receiverId, message, senderUsername)
    //     return
    //   }
    //   setMsg("")
    // } catch (error) {
    //   console.error(error)
    // }
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
      navigate("/")
    }
  }

  return (
    <div className="chat">
      <div className="convContainer">
        {chat.friend && <div className="friendsName">{chat.friend}</div>}
        {chat.group && <div className="friendsName"> {chat.group.name}</div>}
        <div className="conv">
          {error && <h1 className="error-chat-msg">Oops, something went wrong</h1>}
          {!error && (
            <ul>
              {conversation.map((convMsg, index) => (
                <li key={index} className={convMsg.senderId === user.id ? "my-message" : "friend-message"}>
                  {convMsg.senderId !== user.id && <div className="group-msg-sender">{convMsg.senderUsername}</div>}
                  <div>{convMsg.message}</div>
                </li>
              ))}
            </ul>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form action="message" onSubmit={(e) => sendMessage(e)}>
          <label htmlFor="message"></label>
          <textarea
            name="message"
            id="message"
            autoComplete="off"
            rows={3}
            maxLength={500}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          ></textarea>
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
