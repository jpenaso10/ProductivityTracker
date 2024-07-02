import React, { useState } from 'react'
import './LoginForm.css'
import { FaUser,FaLock,FaEnvelope} from "react-icons/fa";
import axios from 'axios'

const LoginForm = () => {

    const [action, setAction] = useState('');

    const registerLink = () => {
        setAction('active');
    };

    const loginLink = () => {
        setAction('');
    };

    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3000/auth/loginform', {
            username, 
            email, 
            password
        })
        .then(response => {
            console.log(response)
        })
        .catch(err => {
            console.log(err)
        })
    }

    return (

        <div className={`wrapper ${action}`}>

            <div className="form-box login">
                <form>
                    <h1>Productivity Tracker</h1>
                    <div className="input-box">
                        <input type="text" placeholder='Username' required/>
                        <FaUser className='icon'/>
                    </div>

                    <div className="input-box">
                        <input type="password" placeholder='Password' required />
                        <FaLock className='icon'/>
                    </div>

                    <div className="remember-forgot">
                        <label><input type="checkbox" />Remember me</label>
                        <a href="#">Forgot password?</a>
                    </div>

                    <button type='submit'>Login</button>

                    <div className="register-link">
                        <p>Don't have an account? <a href="#" onClick={registerLink}>Register</a></p>
                    </div>
                </form>
            </div>

            <div className="form-box register">
                <form onSubmit={handleSubmit}>
                    <h1>Registration</h1>
                    <div className="input-box">
                        <input type="text" placeholder='Username' onChange={(e) => setUsername(e.target.value)} required/>
                        <FaUser className='icon'/>
                    </div>

                    <div className="input-box">
                        <input type="email" placeholder='E-mail' onChange={(e) => setEmail(e.target.value)} required/>
                        <FaEnvelope className= 'icon' />
                    </div>

                    <div className="input-box">
                        <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} required />
                        <FaLock className='icon'/>
                    </div>

                    <div className="remember-forgot">
                        <label><input type="checkbox" />I agree to the terms & conditions</label>
                    </div>

                    <button type='submit'>Register</button>

                    <div className="register-link">
                        <p>Already have an account? <a href="#" onClick={loginLink}>Login</a></p>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default LoginForm