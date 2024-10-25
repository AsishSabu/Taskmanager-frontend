import { FC } from "react"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"
import { RootState } from "../redux/store"

export const PublicRoutes: FC = () => {  
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.userSlice
  )

  if (isAuthenticated) {
    if (role === "employee") {
      return isAuthenticated ? <Navigate to={"/"} replace /> : <Outlet />
    }
    if (role === "manager") {
      return isAuthenticated ? <Navigate to={"/manager"} replace /> : <Outlet />
    }
  } else {
    return <Outlet />
  }
}
