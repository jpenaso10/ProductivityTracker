import express from 'express'
import bcrypt from 'bcrypt'
const router = express.Router();
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

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

router.post('/forgot-password', async (req, res) => {
    const {email} = req.body
    try{
        const user = await User.findOne({email})
            if(!user) {
                return res.json({message: "User not registered"})
            }

            const token = jwt.sign({id: user._id}, process.env.KEY, {expiresIn: '5m'})

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'prod.tracker2024@gmail.com',
                  pass: 'nzif bqmm mwdp lxtq'
                }
              });
              
              var mailOptions = {
                from: 'prod.tracker2024@gmail.com',
                to: email,
                subject: 'Reset Password',
                text: `http://localhost:5173/resetPassword/${token}`
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    return res.json({ message: "Error sending email"})
                } else {
                    return res.json({status: true, message: "Email sent"})
               
                }
              });

    } catch(err) {
        console.log(err)
    }

})

router.post('/reset-password/:token', async (req, res) => {
    const token = req.params;
    const {password} = req.body
    try {
        const decoded = await jwt.verify(token, process.env.KEY)
        const id = decoded.id
        const hashPassword = bcrypt.hash(password, 10)
        await User.findByIdAndUpdate({_id: id}, {password: hashPassword})
        return res.json({status: true, message: "updated password"})
    } catch(err) {
        return res.json("Invalid token")
    }
})


export { router as UserRouter}