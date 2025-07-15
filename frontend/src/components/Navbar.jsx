import { useState } from "react"
import { useLocation, NavLink, useNavigate } from "react-router"
import "../css/Navbar.css"

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebar, setSidebar] = useState(false)

  const sidebarFc = () => setSidebar(!sidebar)

  async function logOut() {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (response.ok) {
        navigate("/", { state: null })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <nav className="navbar">
        <div>FW chat app</div>
        <button onClick={sidebarFc}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>menu</title>
            <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
          </svg>
        </button>
      </nav>
      <div className={sidebar ? "nav-menu active" : "nav-menu"}>
        <button className="btn-close-navbar" onClick={sidebarFc}>
          X
        </button>
        <NavLink to={"/home"} className="nav-text btn-to-home">
          Home
        </NavLink>
        <NavLink to={"/profile"} className="nav-text btn-to-profile">
          Profile
        </NavLink>
        <button onClick={logOut} className="nav-text btn-to-logout">
          Log Out
        </button>
      </div>
    </>
  )
}

export default Navbar
