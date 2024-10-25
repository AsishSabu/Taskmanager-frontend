import React from "react"
import SuperAdminHeader from "../../../components/SuperAdminHeader"

import { Outlet } from "react-router-dom"

const SuperManagementDashboard: React.FC = () => {
  return (
    <>
      <div className="">
        <SuperAdminHeader />
      </div>

      <div>
        <Outlet />
      </div>
    </>
  )
}

export default SuperManagementDashboard
