import  { useEffect, useState } from "react"
import axios from "axios"
import Pagination from "../../../components/Pagination"
import { SERVER_URL } from "../../../constants"


interface User {
  _id: string
  name: string
  email: string
  role: string
  isBlocked: boolean
}

const Employees = () => {
  const [users, setUsers] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const dataPerPage = 8

  const lastPostIndex = currentPage * dataPerPage
  const firstPostIndex = lastPostIndex - dataPerPage
  const currentData = users.slice(firstPostIndex, lastPostIndex)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/manager/getAllEmployees`)
      setUsers(response.data.employees)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-6">
      <div className="bg-white shadow-md rounded-lg p-10 mt-10 ">
        <h3 className="text-xl font-semibold mb-4">Manage Users</h3>
        {users.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          <div>
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map(user => (
                  <tr key={user._id}>
                    <td className="border px-4 py-2">{user.name}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2">
                      {user.isBlocked ? "Blocked" : "Active"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalData={users.length}
        dataPerPage={dataPerPage}
        setCurrentPage={setCurrentPage}
        position=""
      />
    </div>
  )
}

export default Employees
