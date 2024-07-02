import React, { useState } from 'react'
import './Login.css'
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    axios.defaults.withCredentials = true
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post("http://localhost:5000/auth/login", {
            username, 
            password
        })
        .then(response=> {
            if(response.data.status) {
                navigate ('/dashboard')
            }
            
        })
        .catch(err => console.log(err))
    }

  return (
    <div className="wrapper">
        <div className="form-box login">
            <form action="/" onSubmit={handleSubmit}>
                <h1>Productivity Tracker</h1>
                <div className="input-box">
                    <input type="text" placeholder='Username' onChange={(e) => setUsername(e.target.value)} required />
                    <FaUser className='icon'/>
                </div>


                <div className="input-box">
                    <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} required />
                    <FaLock className='icon'/>
                </div>

                <div className="remember-forgot">
                    <label><input type="checkbox"/>Remember me</label>
                    <a href='#'>Forgot password?</a>
                </div>

                <button type='submit'>Login</button>

                <div className="register-link">
                    <p>Don't have an account? <a href="/Signup">Sign Up</a></p>
                </div>

            </form>
        </div>
    </div>
    )

}

export default Login