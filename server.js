import 'express-async-errors'
import express from 'express'
import morgan from 'morgan'
import * as dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'

// router
import jobRouter from './routers/jobRouter.js'
import authRouter from './routers/authRouter.js'
import userRouter from './routers/userRouter.js'

// middleware
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js'
import { authenticateUser } from './middleware/authMiddleware.js'

// public
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'

import cloudinary from 'cloudinary'

const app = express()
// invoke the dotenv package
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

// middleware that make the directory available to the public
const __dirname = dirname(fileURLToPath(import.meta.url))
app.use(express.static(path.resolve(__dirname, './public')))

if (process.env.NODE_ENV === 'development') {
  // set up morgan middleware. morgan is the request logger
  app.use(morgan('dev'))
}

// use cookieParser to access the cookie
app.use(cookieParser())
// set up json middleware
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/', (req, res) => {
  console.log(req)
  res.json({ message: 'Data received', data: req.body })
})

app.get('/api/v1/test', (req, res) => {
  res.json({ msg: 'test route' })
})

// use routes
app.use('/api/v1/jobs', authenticateUser, jobRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', authenticateUser, userRouter)

// the entry point to the frontend application
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public', 'index.html'))
})

app.use('*', (req, res) => {
  res.status(404).json({ msg: 'not found' })
})

app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5100

// connect to the database
try {
  await mongoose.connect(process.env.MONGO_URL)
  app.listen(port, () => {
    console.log(`server running on PORT ${port}....`)
  })
} catch (error) {
  console.log(error)
  process.exit(1)
}
