import React, { useState, useEffect } from "react"
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import axios from "axios"
import { useSelector } from "react-redux"
import { VscPreview } from "react-icons/vsc"
import { SERVER_URL } from "../../constants"
import { RootState } from "../../redux/store"
import Header from "../../components/Header"
import Pagination from "../../components/Pagination"

interface Task {
  _id: string
  title: string
  description: string
  taskDate: Date
  status: string
}

const localizer = momentLocalizer(moment)

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [manager, setManager] = useState("")
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const user = useSelector((state: RootState) => state.userSlice)

  const [viewTask, setViewTask] = useState<Task | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)

  const [currentPage, setCurrentPage] = useState<number>(1)
  const dataPerPage = 3
  const lastPostIndex = currentPage * dataPerPage
  const firstPostIndex = lastPostIndex - dataPerPage
  const currentData = tasks.slice(firstPostIndex, lastPostIndex)
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user || !user.id) {
        return
      }

      try {
        setLoading(true)

        const response = await axios.get(`${SERVER_URL}/getTasks/${user.id}`,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        if (response.data.tasks) {
          setAllTasks(response.data.tasks)
        } 
      }  finally {
        setLoading(false)
      }
    }

    if (user && user.id) {
      fetchTasks()
    }
  }, [user])
  useEffect(() => {
    axios.get(`${SERVER_URL}/profile/${user.id}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }).then(({ data }) => {
      setManager(data.user[0].manager.name)
    })
  }, [])

  useEffect(() => {
    filterTasks()
  }, [selectedDate, allTasks])

  const filterTasks = () => {
    console.log("All Tasks: ", allTasks)

    const filteredTasks = allTasks.filter(
      task =>
        new Date(task.taskDate).toDateString() === selectedDate.toDateString()
    )
    console.log("Filtered Tasks: ", filteredTasks)

    setTasks(filteredTasks)
  }

  const events = allTasks.map(task => ({
    title: task.title,
    start: new Date(task.taskDate),
    end: new Date(task.taskDate),
    allDay: true,
    description: task.description,
    status: task.status,
  }))

  const openModalForView = (task: Task) => {
    setViewTask(task)
    setShowViewModal(true)
  }

  const handleSelectEvent = (event: any) => {
    setSelectedDate(new Date(event.start))
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex-col">
      <Header type="employee" />
      <div className="md:flex">
        <div className="md:w-2/3 flex flex-col md:p-6  bg-white shadow-md">
          <div className="w-full md:p-6 p-3 h-full bg-white shadow-md">
            <h3>Manger Name : {manager}</h3>
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
              onSelectSlot={slotInfo =>
                setSelectedDate(new Date(slotInfo.start))
              }
              dayPropGetter={date => {
                const isSelected =
                  date.toDateString() === selectedDate.toDateString()
                return {
                  className: isSelected ? "selected-date-column" : "",
                }
              }}
            />
          </div>
        </div>

        <div className="md:w-1/3 p-3 md:p-6 bg-white shadow-md">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-700">
              {selectedDate.toDateString()}
            </h2>
          </div>
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center mt-10">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1646/1646760.png"
                alt="Nothing planned"
                className="w-24 h-24 mb-4"
              />
              <p className="text-lg font-medium text-gray-500">
                Nothing planned for the day
              </p>
              <p className="text-sm text-gray-400">Enjoy!</p>
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
                  <p className="text-gray-600">{task.description}</p>
                  <p className="text-gray-500 mt-1">
                    Due: {new Date(task.taskDate).toDateString()}
                  </p>

                  <div>
                    <button
                      title="button"
                      onClick={() => openModalForView(task)}
                      className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
                    >
                      <VscPreview />
                    </button>
                  </div>
                </div>
              ))}
              {tasks.length > 0 && (
                <div className=" md:hidden">
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
            position="bottom-5  right-32 fixed"
          />
        </div>
      )}
    </div>
  )
}

export default Home
