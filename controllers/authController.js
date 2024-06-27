import { StatusCodes } from 'http-status-codes'
import User from '../models/UserModel.js'
import { hashPassword, comparePassword } from '../utils/passwordUtils.js'
import { UnauthenticatedError } from '../errors/customErrors.js'
import { createJWT } from '../utils/tokenUtils.js'

export const register = async (req, res) => {
  const isFirstAccount = (await User.countDocuments()) === 0 // check if the account is the first account in the database
  req.body.role = isFirstAccount ? 'admin' : 'user' // set the first account to be the admin

  const hashedPassword = await hashPassword(req.body.password)
  req.body.password = hashedPassword

  const user = await User.create(req.body)
  res.status(StatusCodes.CREATED).json({ user })
}

export const login = async (req, res) => {
  // check if user exists
  // check if password is correct

  const user = await User.findOne({ email: req.body.email })

  const isValidUser =
    user && (await comparePassword(req.body.password, user.password))
  if (!isValidUser) throw new UnauthenticatedError('invalid credentials')

  // create JSON web token for user that is logged in
  const token = createJWT({ userId: user._id, role: user.role })

  const oneDay = 1000 * 60 * 60 * 24

  // the first variable is the name of the token
  res.cookie('token', token, {
    httpOnly: true, // make the cookie accessible by HTTP only to prevent possible Javascript codes execution in XSS attacks
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production', // if true then this cookie can only be transmitted using https protocol
  })

  res.status(StatusCodes.CREATED).json({ msg: 'user logged in' })
}

export const logout = (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()), // set the cookie expiration time to the current time
  })
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' })
}
