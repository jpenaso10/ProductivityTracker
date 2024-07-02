import express from 'express'
import bcrypt from 'bcrypt'
const router = express.Router();

router.post('/loginform', (req, res) => {
    const {username, email, password} = req.body;
})