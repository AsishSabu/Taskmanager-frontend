import React from "react"
import { Route, Routes } from "react-router-dom"
import ManagerDashboard from "../pages/manager/Home"
// import Dashboard from "../pages/manager/superManager/Dashboard"
import { ProtectedManagerRoute } from "./ProtectedRoutes"
import NotFound from "../components/NotFoundPage"
// import Employees from "../pages/manager/superManager/Employees"
import EmployeeRqst from "../pages/manager/EmployeeRqst"
import Main from "../pages/manager/Main"

const ManagerRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="" element={<ProtectedManagerRoute />}>
        <Route path="/" element={<ManagerDashboard />}>
          <Route path="" element={<Main />} />
          <Route path="/requests" element={<EmployeeRqst />} />
          {/* <Route path="/super" element={<Dashboard />}>
            <Route path="" element={<Employees />} />
          </Route> */}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default ManagerRouter
