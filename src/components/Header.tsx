import React from "react"
import { FaUserCircle } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { RootState } from "../redux/store"
import { clearUser } from "../redux/userSlice"
import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react"

interface headerProps {
  type: string
}

const Header: React.FC<headerProps> = ({ type }) => {
  const user = useSelector((state: RootState) => state.userSlice)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(clearUser())
    navigate("/auth/login")
  }

  return (
    <header className="w-full bg-custom-blue text-white py-4 shadow-md sticky">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <div className="text-2xl font-bold mb-2 md:mb-0">
          Task Assignment Dashboard
        </div>
        <div className="flex  md:items-center justify-between w-full md:w-fit space-x-4">
          <span className="text-lg">Welcome, {user.name || "Manager"}</span>

          <Dropdown
            arrowIcon={false}
            inline
            label={
              <div className="flex items-center space-x-2">
                <FaUserCircle size={30} />
              </div>
            }
          >
            {type === "manager" && (
              <DropdownItem onClick={() => navigate("/manager/requests")}>
                Requests
              </DropdownItem>
            )}
            <DropdownDivider />
            <DropdownItem onClick={handleLogout}>Sign out</DropdownItem>
          </Dropdown>
        </div>
      </div>
    </header>
  )
}

export default Header
