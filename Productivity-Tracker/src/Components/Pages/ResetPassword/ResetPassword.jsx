import React, {useState} from 'react'
import './ResetPassword.css'
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'

function ResetPassword() {
    const [password, setPassword] = useState()
    const {token} = useParams()

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post("http://localhost:5000/auth/reset-password/"+token, {
            password, 
        })
        .then(response => {
            if(response.data.status) {
                navigate('/')
            }
            console.log(response.data)
        })
        .catch(err => console.log(err))
    }

  return (
    <div className="wrapper">
        <div className="form-box login">
            <form action="/" onSubmit={handleSubmit}>
                <h1>Reset Password</h1>
                
                <div className="input-box">
                    <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} required />
                    <FaEnvelope className='icon'/>
                </div>
            
                <button type='submit'>Reset</button>
            </form>
        </div>
    </div>
  )
}

export default ResetPassword