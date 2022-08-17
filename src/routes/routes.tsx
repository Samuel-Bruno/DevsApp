import { Route, Routes } from "react-router-dom"
import Login from "../pages/Login"
import SignUp from "../pages/SignUp"
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
      <Route path="/signup" element={
        <SignUp />
      } />
      <Route path="/login" element={
        <Login />
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