import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './Components/Pages/Login/Login'
import Signup from './Components/Pages/Signup/Signup'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Dashboard from './Components/Pages/Dashboard/Dashboard'
import ForgotPassword from './Components/Pages/ForgotPassword/ForgotPassword'
import ResetPassword from './Components/Pages/ResetPassword/ResetPassword'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/dashboard' element={<Dashboard/>}></Route>
        <Route path='/forgotPassword' element={<ForgotPassword/>}></Route>
        <Route path='/resetPassword/:token' element={<ResetPassword/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App