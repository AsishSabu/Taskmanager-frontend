import Pagination from "../../components/Pagination"
import { VscPreview } from "react-icons/vsc"
import React, { useState, useEffect } from "react"
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import axios from "axios"
import { SERVER_URL } from "../../constants"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import "./calendar.css"
import { FaEdit, FaTrash } from "react-icons/fa"
import showToast from "../../utils/toast"

interface Task {
  _id: string
  title: string
  description: string
  taskDate: Date
  status: string
  assignedTo: string
  empName: string
}

interface Employee {
  _id: string
  name: string
}

const localizer = momentLocalizer(moment)

const Main: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all")
  const [selectedEmployeeName, setSelectedEmployeeName] =
    useState<string>("All Employees")
  const [selectedDate, setSelectedDate] = useState(new Date())

  const [viewTask, setViewTask] = useState<Task | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)

  const [currentPage, setCurrentPage] = useState<number>(1)
  const dataPerPage = 3
  const lastPostIndex = currentPage * dataPerPage
  const firstPostIndex = lastPostIndex - dataPerPage
  const currentData = tasks.slice(firstPostIndex, lastPostIndex)

  const [newTask, setNewTask] = useState<Task>({
    _id: "",
    title: "",
    description: "",
    taskDate: new Date(),
    status: "",
    assignedTo: "",
    empName: "",
  })
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
  const user = useSelector((state: RootState) => state.userSlice)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/manager/employees/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then(response => {
        setEmployees(response.data.employees)
      })
      .catch(error => console.error("Error fetching employees:", error))
  }, [user.id])

  useEffect(() => {
    if (selectedEmployee !== "all") {
      axios
        .get(`${SERVER_URL}/getTasks/${selectedEmployee}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then(response => {
          setAllTasks(response.data.tasks)
        })
        .catch(error => console.error("Error fetching tasks:", error))
    } else {
      axios
        .get(`${SERVER_URL}/manager/getAllTasks/${user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then(response => {
          setAllTasks(response.data.tasks)
        })
        .catch(error => console.error("Error fetching tasks:", error))
    }
  }, [selectedEmployee])

  useEffect(() => {
    fetchTasks()
  }, [selectedDate, allTasks])

  const fetchTasks = () => {
    const filteredTasks = allTasks.filter(
      task =>
        new Date(task.taskDate).toDateString() === selectedDate.toDateString()
    )
    setTasks(filteredTasks)
  }

  const handleAssignTask = async () => {
    if (!newTask.title || !newTask.description) {
      showToast("Please fill all fields to assign a task.", "error")
      return
    } 
    if (selectedDate < today) {
      showToast("You cannot add a task to previous days.", "error")
      return
    }
    const taskData = isEditing
      ? {
          ...newTask,
        }
      : {
          ...newTask,
          taskDate: selectedDate,
          assignedBy: user.id,
          assignedTo: selectedEmployee,
          empName: selectedEmployeeName,
        }

    try {
      const url = isEditing
        ? `${SERVER_URL}/manager/editTask/${newTask._id}`
        : taskData.assignedTo === "all"
        ? `${SERVER_URL}/manager/addTaskToAll`
        : `${SERVER_URL}/manager/addTask`

      const response = await axios.post(url, taskData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      console.log(response)

      if (isEditing) {
        const updatedTasks = allTasks.map(task =>
          task._id === newTask._id ? response.data.data : task
        )
        setAllTasks(updatedTasks)
      } else {
        if (taskData.assignedTo === "all") {
          setAllTasks(prevTasks => [...prevTasks, ...response.data.data])
        } else {
          setAllTasks([...allTasks, response.data.data])
        }
      }
      setShowModal(false)
      setNewTask({
        _id: "",
        title: "",
        description: "",
        taskDate: new Date(),
        status: "",
        assignedTo: "",
        empName: "",
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Error assigning task:", error)
    }
  }

  const openModalForView = (task: Task) => {
    setViewTask(task)
    setShowViewModal(true)
  }

  const events = allTasks.map(task => ({
    title: task.title,
    start: new Date(task.taskDate),
    end: new Date(task.taskDate),
    allDay: true,
    employee: task.assignedTo,
    description: task.description,
    status: task.status,
  }))

  const handleSelectEvent = (event: any) => {
    setSelectedDate(new Date(event.start))
  }

  const openDeleteModal = (task: Task) => {
    setTaskToDelete(task)
    setShowDeleteModal(true)
  }

  const openModalForEdit = (task: Task) => {
    setNewTask(task)
    setShowModal(true)
    setIsEditing(true)
  }

  const openModalForAdd = () => {
    setNewTask({
      _id: "",
      title: "",
      description: "",
      taskDate: selectedDate,
      status: "",
      assignedTo: "",
      empName: "",
    })
    setShowModal(true)
    setIsEditing(false)
  }

  const handleDeleteTask = async () => {
    if (!taskToDelete) return

    try {
      await axios.delete(
        `${SERVER_URL}/manager/deleteTask/${taskToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      )
      setAllTasks(allTasks.filter(task => task._id !== taskToDelete._id))
      setTasks(tasks.filter(task => task._id !== taskToDelete._id))
      setShowDeleteModal(false)
      setTaskToDelete(null)
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }
  return (
    <>
      <div className=" h-screen md:flex">
        <div className="w-full md:p-6 p-2 h-fit md:h-full bg-white shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Task Calendar - {selectedDate.toLocaleDateString()}
          </h2>
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            selectable
            onSelectEvent={handleSelectEvent}
            views={["month"]}
            dayLayoutAlgorithm={"no-overlap"}
            onSelectSlot={slotInfo => setSelectedDate(new Date(slotInfo.start))}
            dayPropGetter={date => {
              const isSelected =
                date.toDateString() === selectedDate.toDateString()
              return {
                className: isSelected ? "selected-date-column" : "",
              }
            }}
          />
        </div>
        <div className="md:w-1/3 w-full md:p-6 p-3 bg-white shadow-md ">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-700 ">
              Tasks for {selectedDate.toDateString()}
            </h2>
            <select
              title="select"
              onChange={e => {
                if (e.target.value === "all") {
                  setSelectedEmployee("all")
                  setSelectedEmployeeName("All Employees")
                } else {
                  const [id, name] = e.target.value.split(",")
                  setSelectedEmployee(id)
                  setSelectedEmployeeName(name)
                }
              }}
              className="block w-full mt-4 mb-6 p-2 border rounded"
            >
              <option value="all">All Employees</option>
              {employees.map(employee => (
                <option
                  key={employee._id}
                  value={`${employee._id},${employee.name}`}
                >
                  {employee.name}
                </option>
              ))}
            </select>

            <button
              onClick={openModalForAdd}
              className={`w-full py-2 rounded transition-all ${
                selectedDate < today
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-custom-blue text-white hover:bg-gray-800"
              }`}
              disabled={selectedDate < today}
            >
              Add New Task
            </button>
          </div>

          {/* Task List */}
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center mt-10">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1646/1646760.png"
                alt="Nothing planned"
                className="w-24 h-24 mb-4"
              />
              <p className="text-lg font-medium text-gray-500">
                No tasks for the selected day
              </p>
            </div>
          ) : (
            <div>
              {currentData.map(task => (
                <div
                  key={task._id}
                  className="task-item bg-gray-100 p-4 mb-4 rounded-lg"
                >
                  <h3 className="text-lg font-semibold text-blue-600">
                    {task.title}
                  </h3>
                  <p className="text-gray-500">Assigned to: {task.empName}</p>
                  <div className="flex justify-between space-x-4">
                    <button
                      title="button"
                      onClick={() => openModalForEdit(task)}
                      className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      <FaEdit />
                    </button>
                    <button
                      title="button"
                      onClick={() => openModalForView(task)}
                      className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
                    >
                      <VscPreview />
                    </button>

                    <button
                      title="button"
                      onClick={() => openDeleteModal(task)}
                      className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
              {tasks.length > 0 && (
                <div className="md:hidden">
                  <Pagination
                    currentPage={currentPage}
                    totalData={tasks.length}
                    dataPerPage={dataPerPage}
                    setCurrentPage={setCurrentPage}
                    position=""
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-10/12 md:w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {isEditing ? "Edit Task" : "Add New Task"}
              </h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              className="block w-full mb-4 p-2 border rounded"
            />
            <textarea
              placeholder="Task Description"
              value={newTask.description}
              onChange={e =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="block w-full mb-4 p-2 border rounded"
            />
            {isEditing ? (
              <select
                value={newTask.assignedTo}
                onChange={e =>
                  setNewTask({ ...newTask, assignedTo: e.target.value })
                }
                className="block w-full mb-4 p-2 border rounded"
              >
                <option value="">Select Employee</option>
                <option value="all">All Employees</option>
                {employees.map(employee => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={newTask.assignedTo}
                onChange={() =>
                  setNewTask({
                    ...newTask,
                    assignedTo: selectedEmployee,
                    empName: selectedEmployeeName,
                  })
                }
                className="block w-full mb-4 p-2 border rounded"
              >
                <option value={selectedEmployee}>{selectedEmployeeName}</option>
              </select>
            )}

            <button
              onClick={handleAssignTask}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-all"
            >
              {isEditing ? "Save Changes" : "Add Task"}
            </button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Delete Confirmation</h2>
            <p className="mb-4 text-gray-500">
              Are you sure you want to delete this item?
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="mr-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all"
              >
                No, cancel
              </button>
              <button
                onClick={handleDeleteTask}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all"
              >
                Yes, I'm sure
              </button>
            </div>
          </div>
        </div>
      )}

      {showViewModal && viewTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-10/12 md:w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">View Task Details</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowViewModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700">Title:</h4>
              <p className="text-gray-600">{viewTask.title}</p>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700">Description:</h4>
              <p className="text-gray-600">{viewTask.description}</p>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700">Date:</h4>
              <p className="text-gray-600">
                {new Date(viewTask.taskDate).toDateString()}
              </p>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700">Assigned to:</h4>
              <p className="text-gray-600">{viewTask.empName}</p>
            </div>
            <button
              onClick={() => setShowViewModal(false)}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {tasks.length > 0 && (
        <div className="hidden md:block">
          <Pagination
            currentPage={currentPage}
            totalData={tasks.length}
            dataPerPage={dataPerPage}
            setCurrentPage={setCurrentPage}
            position="bottom-5  right-14 fixed"
          />
        </div>
      )}
    </>
  )
}

export default Main
