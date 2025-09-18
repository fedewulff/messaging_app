import { useState, useEffect } from "react"

function useDocumentVisibility() {
  const [isDocumentVisible, setIsDocumentVisible] = useState(!document.hidden)

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsDocumentVisible(!document.hidden)
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, []) // Empty dependency array ensures this runs only on mount and unmount

  return isDocumentVisible
}
export default useDocumentVisibility
