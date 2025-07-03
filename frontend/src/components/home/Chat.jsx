import { useState } from "react"
import "../../css/home.css/Chat.css"

function Chat() {
  const [msg, setMsg] = useState("")
  return (
    <div className="chat">
      <div className="convContainer">
        <div className="friendsName">Ana Impollino</div>
        <div className="conv"></div>
        <form action="message">
          <label htmlFor="message"></label>
          <textarea name="message" id="message" autoComplete="off" rows={3} value={msg} onChange={(e) => setMsg(e.target.value)}></textarea>

          <button>
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
