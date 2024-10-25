import { BrowserRouter } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import "./App.css"
import MainRouter from "./routes"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import store, { persistor } from "./redux/store"

function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <BrowserRouter>
            <MainRouter />
          </BrowserRouter>
          <Toaster />
        </PersistGate>
      </Provider>
    </>
  )
}

export default App
