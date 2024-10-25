import React from "react"
import { Route, Routes } from "react-router-dom"
import Home from "../pages/employee/Home"
import { ProtectedEmployeeRoute } from "./ProtectedRoutes"

const EmployeeRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="" element={<ProtectedEmployeeRoute />}>
        <Route path="" element={<Home />} />
      </Route>
    </Routes>
  )
}

export default EmployeeRouter
