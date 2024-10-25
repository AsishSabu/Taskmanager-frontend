import React, { useState, useEffect } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { SERVER_URL } from "../../constants"
import {
  getItemFromLocalStorage,
  removeItemFromLocalStorage,
} from "../../utils/localStorage"
import showToast from "../../utils/toast"
import { useNavigate } from "react-router-dom"

const OTPInputPage: React.FC = () => {
  const [timer, setTimer] = useState<number>(30)
  const [canResend, setCanResend] = useState<boolean>(false)
  const navigate = useNavigate()
  const userId = getItemFromLocalStorage("userId")

  const validationSchema = Yup.object().shape({
    otp: Yup.string()
      .length(6, "OTP must be exactly 6 digits")
      .required("OTP is required")
      .matches(/^\d+$/, "OTP must be digits"),
  })

  const handleSubmit = (values: { otp: string }) => {
    console.log(values.otp)

    axios
      .post(`${SERVER_URL}/verifyOtp`, {
        otp: values.otp,
        userId,
      })
      .then(response => {
        showToast(response.data.message, "success")
        removeItemFromLocalStorage("userId")
        navigate("/auth/login")
      })
      .catch(({ response }) => {
        showToast(response.data.message, "error")
      })
  }

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000)
      return () => clearTimeout(countdown)
    } else {
      setCanResend(true)
    }
  }, [timer])

  const handleResendOTP = () => {

    axios
      .post(`${SERVER_URL}/resendOtp/${userId}`)
      .then(response => {
        showToast(response.data.message,"success")
        setTimer(30)
        setCanResend(false)
      })
      .catch(({ response }) => {
        showToast(response.data.message, "error")
      })
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4">Enter OTP</h2>
      <Formik
        initialValues={{ otp: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="flex flex-col items-center">
            <div className="flex space-x-2 mb-4">
              {[...Array(6)].map((_, index) => (
                <Field
                  key={index}
                  name={`otp`}
                  className="w-12 h-12 text-center border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  maxLength={1}
                  type="text"
                  value={values.otp[index] || ""} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value
                    if (/^\d?$/.test(value)) {
                      const newOtp = values.otp.split("") 
                      newOtp[index] = value 
                      setFieldValue("otp", newOtp.join("")) 
                      if (value && index < 5) {
                        const nextInput = document.getElementById(
                          `otp-input-${index + 1}`
                        )
                        nextInput?.focus()
                      }
                    }
                  }}
                  onKeyDown={(e: any) => {

                    if (
                      e.key === "Backspace" &&
                      index > 0 &&
                      !values.otp[index]
                    ) {
                      const prevInput = document.getElementById(
                        `otp-input-${index - 1}`
                      )
                      prevInput?.focus()
                    }
                  }}
                  id={`otp-input-${index}`} 
                />
              ))}
            </div>

            <button
              type="submit"
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Submit
            </button>

            <ErrorMessage
              name="otp"
              component="div"
              className="text-red-500 mb-4"
            />

            {canResend ? (
              <button
                type="button"
                onClick={handleResendOTP}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-gray-500">
                Resend OTP in <span className="font-semibold">{timer}</span>{" "}
                seconds
              </p>
            )}
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default OTPInputPage
