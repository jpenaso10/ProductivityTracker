import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import { UserRouter } from './routes/user.js'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}))
app.use(cookieParser());

mongoose.connect('mongodb+srv://jpenaso10:K0utaaa2023!@cluster0.vs1qlvf.mongodb.net/authentication')
app.use(express.json())

app.use((req, res, next) => {
    console.log(`Received ${req.method} request to ${req.url}`);
    next();
  });
app.use('/auth', UserRouter)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/public', express.static(path.join(__dirname, 'public')));


app.listen(process.env.PORT, () => {
    console.log("Server is Running..")
})
