async function newAccessToken() {
  const response = await fetch("http://localhost:3000/refreshToken", {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
  const newAccessToken = await response.json()
  return newAccessToken.accessToken
}

export default newAccessToken
