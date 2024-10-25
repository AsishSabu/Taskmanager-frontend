import { FC, useState, useEffect } from "react"
import { Navigate, Outlet } from "react-router-dom"
import axios from "axios"
import { RootState } from "../redux/store"
import { SERVER_URL } from "../constants"
import { useDispatch, useSelector } from "react-redux"
import { clearUser } from "../redux/userSlice"

const fetchUserProfile = async (id: string) => {
  try {
    const response = await axios.get(`${SERVER_URL}/profile/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
    return response.data.user.isBlocked
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw error
  }
}

export const ProtectedEmployeeRoute: FC = () => {
  const { isAuthenticated, role, id } = useSelector(
    (state: RootState) => state.userSlice
  )
  const dispatch = useDispatch()
  const [blocked, setBlocked] = useState(false)  

  useEffect(() => {
    if (id) {
      fetchUserProfile(id)
        .then(isBlocked => {
          setBlocked(isBlocked)
        })
        .catch(error => {
          console.error("Error checking user block status:", error)
          setBlocked(true)
        })
    }
  }, [id])

  if (blocked) {
    dispatch(clearUser())
    return <Navigate to={"/login"} replace />
  }

  return isAuthenticated && role === "employee" ? (
    <Outlet />
  ) : (
    <Navigate to={"/auth/login"} replace />
  )
}

export const ProtectedAllUserRoute: FC = () => {
  const { role, id } = useSelector((state: RootState) => state.userSlice)
  const dispatch = useDispatch()
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    if (id) {
      // Ensure 'id' is defined
      fetchUserProfile(id)
        .then(isBlocked => {
          setBlocked(isBlocked)
        })
        .catch(error => {
          console.error("Error checking user block status:", error)
          setBlocked(true)
        })
    }
  }, [id])

  if (blocked) {
    dispatch(clearUser())
    return <Navigate to={"/login"} replace />
  }

  return role !== "owner" ? <Outlet /> : <Navigate to={"/manager"} replace />
}

// Protected route for Managers
export const ProtectedManagerRoute: FC = () => {
  const { isAuthenticated, role, id } = useSelector(
    (state: RootState) => state.userSlice
  )
  console.log(role, "roleeeeeeeeee")

  const dispatch = useDispatch()
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    if (id) {
      fetchUserProfile(id)
        .then(isBlocked => {
          setBlocked(isBlocked)
        })
        .catch(error => {
          console.error("Error checking user block status:", error)
          setBlocked(true)
        })
    }
  }, [id])

  if (blocked) {
    dispatch(clearUser())
    return <Navigate to={"/login"} replace />
  }

  return isAuthenticated && role === "manager" ? (
    <Outlet />
  ) : (
    <Navigate to={"/login"} replace />
  )
}
