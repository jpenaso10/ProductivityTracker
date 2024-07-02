import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './Components/Pages/Login/Login'
import Signup from './Components/Pages/Signup/Signup'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Dashboard from './Components/Pages/Dashboard/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/dashboard' element={<Dashboard/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App