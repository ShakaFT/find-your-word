const express = require('express')
const userController = require("../controllers/user.controller")
const userRouter = express.Router()

userRouter.get('/', userController.login)

module.exports = userRouter
