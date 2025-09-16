const URL = import.meta.env.VITE_BACKEND_URL
async function newAccessToken() {
  const response = await fetch(`${URL}/refreshToken`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
  const newAccessToken = await response.json()
  return newAccessToken.accessToken
}

export default newAccessToken
