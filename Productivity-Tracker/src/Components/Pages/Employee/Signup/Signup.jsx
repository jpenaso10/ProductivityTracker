import React, { useState } from 'react'
import './Signup.css'
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Signup() {

    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post("http://localhost:5000/auth/signup", {
            username, 
            email, 
            password
        })
        .then(response=> {
            if(response.data.status) {
                navigate ('/')
            }
            
        })
        .catch(err => console.log(err))
    }

  return (
    <div className="wrapper">
        <div className="form-box login">
            <form action="/" onSubmit={handleSubmit}>
                <h1>Sign up</h1>
                <div className="input-box">
                    <input type="text" placeholder='Username' onChange={(e) => setUsername(e.target.value)} required />
                    <FaUser className='icon'/>
                </div>

                <div className="input-box">
                    <input type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} required />
                    <FaEnvelope className='icon'/>
                </div>

                <div className="input-box">
                    <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} required />
                    <FaLock className='icon'/>
                </div>

                <div className="remember-forgot">
                    <label><input type="checkbox"/>I agree to the terms & conditions</label>
                </div>

                <button type='submit'>Register</button>

                <div className="register-link">
                    <p>Already have an account <a href="/">Login</a></p>
                </div>

            </form>
        </div>
    </div>
    )

}

export default Signup