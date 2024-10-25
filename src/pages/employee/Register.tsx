import { Link, useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup" // For form validation
import React, { useEffect, useState } from "react"
import axios from "axios"
import { SERVER_URL } from "../../constants"
import showToast from "../../utils/toast"
import { setItemToLocalStorage } from "../../utils/localStorage"

// Define interface for form fields
interface SignupFormValues {
  name: string
  email: string
  password: string
  role: string 
  managerId?: string 
}
interface manager {
  _id: string
  name: string
}


const Register: React.FC = () => {
  const [isManager, setIsManager] = useState(false)
  const [managers,setManagers]=useState<manager[]>([])
  const navigate = useNavigate()

  const formik = useFormik<SignupFormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "employee",
      managerId: "", 
    },
    validationSchema: Yup.object({
      name: Yup.string()
      .matches(/^[a-zA-Z ]+$/, "Name can only contain letters and spaces")
      .required("Required"),
    
      email: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/,
        "Invalid email address"
      )
      .required("Required"),
    
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .matches(/^\S*$/, "Password cannot contain spaces")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .required("Required"),
    
    managerId: !isManager
      ? Yup.string().required("Manager selection is required for Employees")
      : Yup.string(),
    }),
    onSubmit: ({ name, email, password,managerId}) => {
            
      axios.post(SERVER_URL + "/register", {
        name,
        email,
        password,
        role:!isManager?"employee":"manager",
        manager:managerId
      })
      .then(({data})=>{ 
        showToast(data.message, "success")
        setTimeout(() => {
          setItemToLocalStorage("userId",data.user._id)
          navigate("/auth/verifyOtp")
        },0)     
      })
      .catch(({response})=>{
        showToast(response.data.message,"error")        
      })
    },
  })

  useEffect(()=>{
    axios.get(SERVER_URL+"/manager/getAllManagers")
     .then(({data})=>{
        setManagers(data.managers)
      })
     .catch((error)=>{
        console.error(error);
      })
  },[])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white md:p-10 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-4">
          <img
            alt="logo"
            className="h-14 w-14"
            src="https://ik.imagekit.io/pibjyepn7p9/Lilac_Navy_Simple_Line_Business_Logo_CGktk8RHK.png?ik-sdk-version=javascript-1.4.3&updatedAt=1649962071315"
          />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Sign Up for an account
        </h2>
        <p className="text-center text-sm text-gray-600 mt-5">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="font-medium text-purple-600 hover:text-purple-500"
          >
            Login
          </Link>
        </p>

        <form className="mt-5 space-y-3" onSubmit={formik.handleSubmit}>
          <div className="-space-y-px">
            <div className="mb-5">
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Enter your name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.name}
                </div>
              ) : null}
            </div>

            <div className="mt-5 space-y-3">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>

            <div className="mt-5 space-y-3">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Enter your password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>

            {!isManager && (
              <div className="mt-5 space-y-3">
                <label htmlFor="managerId" className="sr-only">
                  Select Manager
                </label>
                <select
                  id="managerId"
                  name="managerId"
                  className="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.managerId}
                >
                  <option value="" label="Select a manager" />
                  {managers.map(manager => (
                    <option key={manager._id} value={manager._id}>
                      {manager.name}
                    </option>
                  ))}
                </select>
                {formik.touched.managerId && formik.errors.managerId ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.managerId}
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div className="mt-8 space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isManager}
                onChange={e => {
                  setIsManager(e.target.checked) 
                  formik.setFieldValue("managerId", "") 
                }}
                className="mr-2"
              />
              Sign up as Manager
            </label>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-5"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
