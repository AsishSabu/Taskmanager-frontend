import React from "react"
import { FaUserCircle } from "react-icons/fa"
import {
  Dropdown,
  DropdownDivider,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
} from "flowbite-react"
import { logo2 } from "../assets"

const SuperAdminHeader: React.FC = () => {
  const handleLogOut = () => {
    console.log("User logged out")
  }

  return (
    <Navbar fluid rounded className="bg-gray-800 text-white w-full h-20 pt-3">
      <div className="flex justify-between w-full">
        <NavbarBrand className="flex items-center space-x-2">
          <img src={logo2} className="w-32 h-16 rounded-2xl" alt="Dummy Logo" />
          {/* <span className="text-lg font-semibold text-white">Dashboard</span> */}
        </NavbarBrand>
        <div className="space-x-4">
          <NavbarCollapse>
            {["Employees", "Managers", "Requests"].map((navbar, index) => (
              <NavbarLink
                key={index}
                className="text-white text-lg hover:text-gray-300 mx-3"
                active={false}
              >
                {navbar}
              </NavbarLink>
            ))}
          </NavbarCollapse>
        </div>

        <div className="flex md:order-2 items-center">
          {/* Notification Icon or Placeholder */}
          <FaUserCircle size={40} className="text-white mr-3" />

          {/* Dropdown for Profile, Settings, and Logout */}
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <div className="flex items-center space-x-2">
                <span className="font-bold hidden md:block">John Doe</span>{" "}
                {/* Static Name */}
              </div>
            }
          >
            {/* Dropdown Items for Small Screens */}
            <div className="md:hidden">
              {["Employees", "Managers", "Requests"].map(
                (dropdownItem, index) => (
                  <DropdownItem key={index}>{dropdownItem}</DropdownItem>
                )
              )}
            </div>

            <DropdownDivider />

            {/* Profile Dropdown Items */}
            {["Profile", "Messages", "Notifications"].map(
              (dropdownItem, index) => (
                <DropdownItem key={index}>{dropdownItem}</DropdownItem>
              )
            )}

            <DropdownDivider />

            {/* Logout */}
            <DropdownItem onClick={handleLogOut}>Sign out</DropdownItem>
          </Dropdown>
        </div>

        {/* Navbar Links (Hidden on small screens, visible on larger) */}
      </div>
    </Navbar>
  )
}

export default SuperAdminHeader
