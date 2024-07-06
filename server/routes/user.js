import express from 'express'
import bcrypt from 'bcrypt'
const router = express.Router();
import { User, Admin } from '../models/user.js';
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'


/* Employee/User Registration Form to DB */

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

/* Admin Registration Form to DB */

router.post('/admin', async (req, res) => {
    const {username, email, password} = req.body
    const admin = await Admin.findOne({username,email})
    if(admin) {
        return res.json({message: "User already existed"})
    }

    const hashpassword = await bcrypt.hash(password, 10)
    const newadmin = new Admin({
        username,
        email,
        password: hashpassword
    })

    await newadmin.save()
    return res.json({status: true, message: "Record registered"})

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
    const {token} = req.params;
    const {password} = req.body

    try {
        const decoded = jwt.verify(token, process.env.KEY);

        const user = await User.findById(decoded.id)
        if(!user) {
            return res.status(400).json({ message: "Invalid token or user does not exist" });
        }

        const hashPassword = await bcrypt.hash(password, 10)
        user.password = hashPassword;
        await user.save();
        
        res.json({ status: true, message: "Password reset successfully" });
    } catch(err) {
        console.error(err);
        res.status(400).json({ message: "Invalid or expired token" });
    }
})

const verifyUser = async (req, res, next) => {
    try{
        const token = req.cookies.token
        if(!token) {
        return res.json({status: false, message: "no token"})
        }
        const decoded = jwt.verify(token, process.env.KEY)
        next()
    } catch(err) {
        return res.json(err)
    }
    
}

router.get('/verify', verifyUser, (req,res) => {
    return res.json({status: true, message: "authorized"})

})


 /* Employee status */


 router.put('/status', async (req, res) => {
    const { userId, status } = req.body;
  
    if (!['active', 'break', 'lunch', 'not working'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
  
    try {
      const user = await User.findByIdAndUpdate(userId, { status }, { new: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ status: user.status });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });



export { router as UserRouter}