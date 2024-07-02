import React from 'react'
import './App.css'
import LoginForm from './Components/Pages/LoginForm/LoginForm'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/loginform' element={<LoginForm/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App