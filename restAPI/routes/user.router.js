const express = require('express')
const userController = require("../controllers/user.controller")
const userRouter = express.Router()

userRouter.post('/', userController.createUser)
userRouter.post('/login', userController.loginUser)
userRouter.delete('/:id', userController.deleteUser)
userRouter.put('/:id/password', userController.updatePasswordUser)
userRouter.put('/:id/profile', userController.updateProfileUser)

module.exports = userRouter
