import React from "react"
import { Route, Routes } from "react-router-dom"
import EmployeeRouter from "./EmployeeRouter"
import ManagerRouter from "./ManagerRouter"
import NotFound from "../components/NotFoundPage"
import AuthRouter from "./AuthRouter"

const MainRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<EmployeeRouter />} />
      <Route path="/auth/*" element={<AuthRouter/>} /> 
      <Route path="/manager/*" element={<ManagerRouter />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default MainRouter
