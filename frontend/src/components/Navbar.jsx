import { useState } from "react"
import { useLocation, NavLink } from "react-router"
import "../css/Navbar.css"

function Navbar({ user }) {
  const location = useLocation()
  const [sidebar, setSidebar] = useState(false)

  const sidebarFc = () => setSidebar(!sidebar)

  return (
    <>
      <nav className="navbar">
        <div>Fede Wulff</div>
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
        <NavLink to={"/profile"} className="nav-text btn-to-profile" state={{ ...location.state, user: user }}>
          Profile
        </NavLink>
        <button className="nav-text btn-to-logout">Log Out</button>
      </div>
    </>
  )
}

export default Navbar
