import { useState } from "react"
import { NavLink, useNavigate, useLocation } from "react-router"
import "../css/LogIn-SignUp-Error.css"
import { GiCapybara } from "react-icons/gi"
const URL = import.meta.env.VITE_BACKEND_URL

function LogIn() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  async function login(e) {
    e.preventDefault()
    try {
      const response = await fetch(`${URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      if (response.ok) {
        navigate("/home", { state: { token: data.accessToken } })
      } else {
        console.error("Login error:", data.errorMessage)
        setErrorMessage(data.errorMessage)
      }
    } catch (error) {
      console.error("Network error:", error)
    }
  }

  return (
    <>
      <GiCapybara className="capybara-icon" />
      <div className="formContainer">
        <form action="" method="post" className="vertical" onSubmit={login}>
          <div className="vertical">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              autoComplete="off"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="vertical">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="errorMsg">{errorMessage}</div>
          <button type="submit">Log in</button>
        </form>
        <div className="or">or</div>
        <NavLink to="/signup" className="signupButton">
          Sign up
        </NavLink>
      </div>
    </>
  )
}

export default LogIn
