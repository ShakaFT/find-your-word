const express = require('express')
const wordController = require("../controllers/word.controller")
const wordRouter = express.Router()

wordRouter.get('/exists', wordController.existsWord)

wordRouter.get('/random', wordController.randomWord)

module.exports = wordRouter
