import { Route, Routes } from "react-router-dom"
import { PublicRoutes } from "./PublicRoute"
import Login from "../pages/employee/Login"
import Register from "../pages/employee/Register"
import NotFound from "../components/NotFoundPage"
import OtpInputPage from "../pages/employee/OtpPage"

const AuthRouter = () => {
  return (
    <Routes>
      <Route path="" element={<PublicRoutes />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verifyOtp" element={<OtpInputPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AuthRouter
