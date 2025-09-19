import { useState } from "react"
import "../css/LogIn-SignUp-Error.css"
import { NavLink, useNavigate } from "react-router"
import { GiCapybara } from "react-icons/gi"
const URL = import.meta.env.VITE_BACKEND_URL

function SignUp() {
  const [username, setUsername] = useState("")
  const [isValidUsername, setIsValidUsername] = useState(false)
  const [password, setPassword] = useState("")
  const [isValidPwd, setIsValidPwd] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isValidConfPwd, setIsValidConfPwd] = useState(false)
  const [passwordsMatch, setPasswordsMatch] = useState(false)
  const [signUpError, setSignUpError] = useState([])

  const navigate = useNavigate()

  function validateUsername(e) {
    const username = e.target.value
    setUsername(username)
    const usernameRegex = /^.{4,20}$/
    setIsValidUsername(usernameRegex.test(username))
  }
  function validatePassword(e) {
    const newPassword = e.target.value
    setPassword(newPassword)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.!@#$%^&*()_+])[A-Za-z\d.!@#$%^&*()_+]{8,25}$/
    setIsValidPwd(passwordRegex.test(newPassword))
    if (confirmPassword === newPassword) {
      setPasswordsMatch(true)
    } else setPasswordsMatch(false)
  }
  function validateConfPassword(e) {
    const newConfPassword = e.target.value
    setConfirmPassword(newConfPassword)
    const confirmPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.!@#$%^&*()_+])[A-Za-z\d.!@#$%^&*()_+]{8,25}$/
    setIsValidConfPwd(confirmPasswordRegex.test(newConfPassword))
    if (newConfPassword === password) {
      setPasswordsMatch(true)
    } else setPasswordsMatch(false)
  }
  async function signUp(e) {
    e.preventDefault()
    if (!isValidUsername || !isValidPwd || !isValidConfPwd || !passwordsMatch) {
      setSignUpError((prevErrors) => [...prevErrors, { msg: "Inputs are not correct" }])
      return
    }
    try {
      const response = await fetch(`${URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, confirmPassword }),
      })
      const data = await response.json()
      if (response.ok && !data.errors) {
        navigate("/")
      } else {
        if (data.errors) {
          for (let i = 0; i < data.errors.length; i++) {
            console.error("Signup error:", data.errors[i].msg)
          }
          setSignUpError(data.errors)
        } else {
          console.error("Signup error")
        }
      }
    } catch (error) {
      console.error("Network error:", error)
    }
  }

  return (
    <>
      <GiCapybara className="capybara-icon" />
      <div className="formContainer">
        <form action="" method="post" className="vertical" onSubmit={signUp}>
          <div className="vertical">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              autoComplete="off"
              className={!username || isValidUsername ? "valid-input" : "not-valid-input"}
              value={username.replace(/\s/g, "")}
              onChange={validateUsername}
            />
            <div className="input-requirements">Must be 4-20 characters long</div>
          </div>
          <div className="vertical">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className={!password || isValidPwd ? "valid-input" : "not-valid-input"}
              value={password.replace(/\s/g, "")}
              onChange={validatePassword}
            />
            <div className="input-requirements">
              Must be 8-25 characters long, include uppercase, lowercase, number, and special character: .!@#$%^&*()_+{" "}
            </div>
          </div>
          <div className="vertical">
            <label htmlFor="password">Confirm password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className={!confirmPassword || (isValidConfPwd && passwordsMatch) ? "valid-input" : "not-valid-input"}
              value={confirmPassword.replace(/\s/g, "")}
              onChange={validateConfPassword}
            />
          </div>
          <ul>
            {signUpError.map((error, index) => (
              <li key={index} className="errorMsg">
                {error.msg}
              </li>
            ))}
          </ul>

          <button type="submit">Sign up</button>
        </form>
        <NavLink to="/" className="backToLogin">
          Back to login
        </NavLink>
      </div>
    </>
  )
}

export default SignUp
