const express = require('express')
const userController = require("../controllers/user.controller")
const userRouter = express.Router()

userRouter.get('/', userController.getUser)
userRouter.post('/', userController.createUser)
userRouter.put('/:id/password', userController.updateUser)
userRouter.put('/:id/profile', userController.updateUser)
userRouter.delete('/:id', userController.deleteUser)

module.exports = userRouter
