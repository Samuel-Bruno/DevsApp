import { Route, Routes } from "react-router-dom"
import PRoute from "./authRoute"
import Login from "../pages/Login"
import ChatPage from "../pages/Chat"
import ConfigPage from "../pages/Config"
import AuthRoute from "./authRoute"
import Logout from "../pages/Logout"


const Router = () => {


  return (
    <Routes>
      <Route path="/" element={
        <AuthRoute>
          <ChatPage />
        </AuthRoute>
      } />
      <Route path="/login" element={
        <Login />
      } />
      <Route path="/signup" element={
        <AuthRoute>
          <Login signup />
        </AuthRoute>
      } />
      <Route path="/config" element={
        <AuthRoute>
          <ConfigPage />
        </AuthRoute>
      } />
      <Route path="/logout" element={
        <Logout />
      } />
    </Routes>
  )

}


export default Router