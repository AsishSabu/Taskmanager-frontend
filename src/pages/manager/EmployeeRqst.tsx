import React, { useState, useEffect } from "react"
import axios from "axios"
import { SERVER_URL } from "../../constants"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import Pagination from "../../components/Pagination"

interface Employee {
  _id: string
  name: string
  email: string
  role: string
  status: string
  isBlocked: boolean
}

const EmployeeRqst: React.FC = () => {
  const [requests, setRequests] = useState<Employee[]>([])
  const user = useSelector((state: RootState) => state.userSlice)

  const [currentPage, setCurrentPage] = useState<number>(1)
  const dataPerPage = 5
  const lastPostIndex = currentPage * dataPerPage
  const firstPostIndex = lastPostIndex - dataPerPage
  const currentData = requests.slice(firstPostIndex, lastPostIndex)

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/manager/getAllRequests/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then(response => {
        setRequests(response.data.employees)
      })
      .catch(error => {
        console.error("Error fetching employee requests:", error)
      })
  }, [user.id])

  const handleDecision = (employeeId: string) => {
    axios
      .patch(
        `${SERVER_URL}/manager/employee/${employeeId}`,
        { status: "approved" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      )
      .then(response => {
        console.log(response)
        setRequests(prevRequests =>
          prevRequests.filter(request => request._id !== employeeId)
        )
      })
      .catch(error => {
        console.error("Error updating employee status:", error)
      })
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Pending Employee Requests
      </h2>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
        {requests.length === 0 ? (
          <div className="text-center py-6 text-gray-600">
            <p className="text-lg">No available requests.</p>
          </div>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-200 border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Email
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.map(employee => (
                <tr key={employee._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{employee.name}</td>
                  <td className="py-3 px-4">{employee.email}</td>
                  <td
                    className={`py-3 px-4 ${
                      employee.status === "Approved"
                        ? "text-green-500"
                        : employee.status === "Rejected"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {employee.status}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {employee.status === "pending" && (
                      <button
                        onClick={() => handleDecision(employee._id)}
                        className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-all"
                      >
                        Accept
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {requests.length > 0 && (
        <div className="md:hidden">
          <Pagination
            currentPage={currentPage}
            totalData={requests.length}
            dataPerPage={dataPerPage}
            setCurrentPage={setCurrentPage}
            position=""
          />
        </div>
      )}
    </div>
  )
}

export default EmployeeRqst
