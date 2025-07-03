import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router"
import "./css/index.css"
//import App from "./components/App"
import LogIn from "./components/LogIn"
import ErrorPage from "./components/ErrorPage"
import SignUp from "./components/SignUp"
import Home from "./components/home/Home"
import Profile from "./components/profile/Profile"

const router = createBrowserRouter([
  {
    path: "/",
    element: <LogIn />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  // {
  //   path: "/admin-profile/post/:postId",
  //   element: <Post />,
  //   errorElement: <ErrorPage />,
  // },
])

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <RouterProvider router={router} />
  // </StrictMode>
)
