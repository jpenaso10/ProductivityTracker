import express from 'express'
import bcrypt from 'bcrypt'
const router = express.Router();
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken'

router.post('/signup', async (req, res) => {
    const {username, email, password} = req.body
    const user = await User.findOne({username,email})
    if(user) {
        return res.json({message: "User already existed"})
    }

    const hashpassword = await bcrypt.hash(password, 10)
    const newuser = new User({
        username,
        email,
        password: hashpassword
    })

    await newuser.save()
    return res.json({status: true, message: "Record registered"})

})

router.post('/login', async (req, res) => {
    const {username, password} = req.body
    const user = await User.findOne({username})
    if(!user) {
        return res.json({message: "User is not registered"})
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if(!validPassword) {
        return res.json({message: "password is incorrect"})
    }

    const token = jwt.sign({username: user.username}, process.env.KEY, {expiresIn: '1h'})
    res.cookie('token', token, {httpOnly: true, maxAge: 360000})
    return res.json({status: true, message: "login successfully"})
})

export { router as UserRouter}