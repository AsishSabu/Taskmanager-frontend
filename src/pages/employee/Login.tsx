import { Link, useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup" 
import React from "react"
import axios from "axios"
import { SERVER_URL } from "../../constants"
import { setItemToLocalStorage } from "../../utils/localStorage"
import { useDispatch } from "react-redux"
import { setUser } from "../../redux/userSlice"
import showToast from "../../utils/toast"

interface LoginFormValues {
  email: string
  password: string
}

interface LoginField {
  id: string
  labelText: string
  labelFor: string
  name: keyof LoginFormValues
  type: string
  isRequired: boolean
  placeholder: string
}

const loginFields: LoginField[] = [
  {
    id: "email",
    labelText: "Email",
    labelFor: "email",
    name: "email",
    type: "email",
    isRequired: true,
    placeholder: "Enter your email",
  },
  {
    id: "password",
    labelText: "Password",
    labelFor: "password",
    name: "password",
    type: "password",
    isRequired: true,
    placeholder: "Enter your password",
  },
]

const fixedInputClass =
  "rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"

const Login: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/,
          "Invalid email address"
        )
        .required("Required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .matches(/^\S*$/, "Password cannot contain spaces")

        .required("Required"),
    }),
    onSubmit: ({ email, password }) => {
      axios
        .post(SERVER_URL + "/login", {
          email,
          password,
        })
        .then(({ data }) => {
          const { message, accessToken } = data
          const { name, role, _id } = data.user
          setItemToLocalStorage("access_token", accessToken)
          dispatch(setUser({ isAuthenticated: true, name, role, id: _id }))
          showToast(message, "success")
          if (role === "employee") {
            navigate("/")
          } else {
            navigate("/manager")
          }
        })
        .catch(({ response }) => {
          showToast(response?.data?.message, "error")
        })
    },
  })

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
          Login to your account
        </h2>
        <p className="text-center text-sm text-gray-600 mt-5">
          Don't have an account yet?{" "}
          <Link
            to="/auth/register"
            className="font-medium text-purple-600 hover:text-purple-500"
          >
            Signup
          </Link>
        </p>
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div className="-space-y-px">
            {loginFields.map(field => (
              <div key={field.id} className="my-5">
                <label htmlFor={field.labelFor} className="sr-only">
                  {field.labelText}
                </label>
                <input
                  id={field.id}
                  name={field.name}
                  type={field.type}
                  required={field.isRequired}
                  className={fixedInputClass}
                  placeholder={field.placeholder}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values[field.name]}
                />
                {formik.touched[field.name] && formik.errors[field.name] ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors[field.name]}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
