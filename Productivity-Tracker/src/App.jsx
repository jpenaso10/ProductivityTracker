import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './Components/Pages/Login/Login'
import Signup from './Components/Pages/Signup/Signup'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App