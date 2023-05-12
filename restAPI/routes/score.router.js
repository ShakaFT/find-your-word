const express = require('express')
const scoreController = require("../controllers/score.controller")
const scoreRouter = express.Router()

scoreRouter.get('/', scoreController.getScore)
scoreRouter.post('/', scoreController.createScore)

module.exports = scoreRouter
