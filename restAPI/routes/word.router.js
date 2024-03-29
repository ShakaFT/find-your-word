const express = require('express')
const wordController = require("../controllers/word.controller")
const wordRouter = express.Router()

wordRouter.get('/daily', wordController.getDailyWords)
wordRouter.post('/daily', wordController.generateDailyWord)
wordRouter.get('/exists', wordController.existsWord)
wordRouter.get('/random', wordController.randomWord)

module.exports = wordRouter
