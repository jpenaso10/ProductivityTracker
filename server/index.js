import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import { UserRouter } from './routes/user.js'

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect('mongodb+srv://jpenaso10:K0utaaa2023!@cluster0.vs1qlvf.mongodb.net/authentication')
app.use(express.json())
app.use('/auth', UserRouter)

app.listen(process.env.PORT, () => {
    console.log("Server is Running..")
})
