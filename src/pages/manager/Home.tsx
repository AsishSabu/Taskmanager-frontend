
import { Outlet } from "react-router-dom"
import Header from "../../components/Header"


const ManagerDashboard: React.FC = () => {


  return (
    <div className="min-h-screen bg-gray-50 ">
      <Header type="manager"/>
      <div>
        <Outlet/>
      </div>

    </div>
  )
}

export default ManagerDashboard
