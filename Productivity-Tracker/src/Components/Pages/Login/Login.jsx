import React, { useState } from 'react'
import './Login.css'
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa'
import Axios from 'axios'

function Signup() {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        Axios.post('http://localhost:3000/auth/signup', {
            username, 
            email, 
            password,
        })
        .then(response => {
            console.log(response)
        })
        .catch(err => {
            console.log(err)
        })
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
                    <p>Don't have an account? <a href="/Signup">Register</a></p>
                </div>

            </form>
        </div>
    </div>
    )

}

export default Signup