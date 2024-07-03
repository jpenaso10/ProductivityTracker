import React, {useState} from 'react'
import './ForgotPassword.css'
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

function ForgotPassword() {
    const [email, setEmail] = useState()

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post("http://localhost:5000/auth/forgot-password", {
            email, 
        })
        .then(response=> {
            if(response.data.status) {
                alert("Check your email for RESET password link")
                navigate('/')
            }
            
        })
        .catch(err => console.log(err))
    }

  return (
    <div className="wrapper">
        <div className="form-box login">
            <form action="/" onSubmit={handleSubmit}>
                <h1>Forgot Password</h1>
                <h2>Enter the email associated with your account and well send you a link to reset your password.</h2>
                
                <div className="input-box">
                    <input type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} required />
                    <FaEnvelope className='icon'/>
                </div>

                <div className="register-link">
                    <p>Don't have an account? <a href="/Signup">Sign Up</a></p>
                </div>


            
                <button type='submit'>Send</button>
            </form>
        </div>
    </div>
  )
}

export default ForgotPassword