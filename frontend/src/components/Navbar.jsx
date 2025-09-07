import { useState } from "react"
import { NavLink, useNavigate } from "react-router"
import "../css/Navbar.css"
import { socket } from "../../socket/socket"

function Navbar({ showFriends, setShowFriends }) {
  const navigate = useNavigate()
  const [sidebar, setSidebar] = useState(false)

  const sidebarFc = (value) => setSidebar(value)
  const showFriendsCont = () => setShowFriends(!showFriends)
  async function logOut() {
    socket.disconnect()
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
        <button className="show-friends-and-groups" onClick={showFriendsCont}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>account-multiple</title>
            <path d="M16 17V19H2V17S2 13 9 13 16 17 16 17M12.5 7.5A3.5 3.5 0 1 0 9 11A3.5 3.5 0 0 0 12.5 7.5M15.94 13A5.32 5.32 0 0 1 18 17V19H22V17S22 13.37 15.94 13M15 4A3.39 3.39 0 0 0 13.07 4.59A5 5 0 0 1 13.07 10.41A3.39 3.39 0 0 0 15 11A3.5 3.5 0 0 0 15 4Z" />
          </svg>
        </button>
        <div>FW chat app</div>
        <button onClick={() => sidebarFc(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>menu</title>
            <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
          </svg>
        </button>
      </nav>
      <div className={sidebar ? "nav-menu active" : "nav-menu"}>
        <button className="btn-close-navbar" onClick={() => sidebarFc(false)}>
          X
        </button>
        <NavLink to={"/home"} onClick={() => sidebarFc(false)} className="nav-text btn-to-home">
          Home
        </NavLink>
        <NavLink to={"/profile"} onClick={() => sidebarFc(false)} className="nav-text btn-to-profile">
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
