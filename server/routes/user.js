import express from 'express'
import bcrypt from 'bcrypt'
const router = express.Router();
import { User } from '../models/user.js';

router.post('/signup', async (req, res) => {
    const {username, email, password} = req.body
    const user = await User.findOne({email})
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

export { router as UserRouter}