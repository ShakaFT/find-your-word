const { ALLOWED_LANGS, MAXIMUM_WORD_LENGTH, MINIMUM_WORD_LENGTH } = require("../constants")
const iso = require('iso-639-1')
const { getWordModel } = require('../models/word.model')
const utils = require('../utils')

function existsWord(req, res) {
    const wordRegex = /^[a-zA-Z]+$/
    let { lang, word } = req.query
    lang = lang.toLowerCase()

    // Error handling
    if (!iso.validate(lang) || !ALLOWED_LANGS.includes(lang)) {
        utils.bad_request(res, "`lang` must follow ISO 3166-1 alpha-2 format.")
        return
    }
    if (!wordRegex.test(word) || !word) {
        utils.bad_request(res, "`word` should be string.")
        return
    }

    const Word = getWordModel(lang)

    Word.find({ text: word.toUpperCase() })
        .then(words => res.send({ exists: words.length > 0 }))
        .catch(error => utils.internal_server(res, error))
}

function generateDailyWord(req, res) {
    console.log(req.headers)
    if (req.headers['x-cloudscheduler'] !== "true") {
        utils.unauthorized(res)
        return
    }
    const todayTimestamp = utils.todayTimestamp()

    ALLOWED_LANGS.forEach(lang => {
        const Word = getWordModel(lang)

        Word.countDocuments({ dailyTimestamp: { $exists: false } })
            .then(count => {
                Word.findOne({ dailyTimestamp: { $exists: false } })
                    .skip(randomIndex = Math.floor(Math.random() * count))
                    .exec()
                    .then(word => {
                        Word.findByIdAndUpdate(word._id, { dailyTimestamp: todayTimestamp })
                            .catch(error => utils.internal_server(res, error))
                    })
                    .catch(error => utils.internal_server(res, error))
            })
            .catch(error => utils.internal_server(res, error))
    })
    res.status(204).send()
}

function getDailyWord(req, res) {
    const { daily_timestamp } = req.query
    const dailyTimestamp = parseInt(daily_timestamp)
    const result = {}

    if (isNaN(dailyTimestamp)) {
        utils.bad_request(res, "`daily_timestamp` should be integer")
        return
    }

    Promise.all(ALLOWED_LANGS.map(async lang => {
        const Word = getWordModel(lang)
        const word = await Word.findOne({ dailyTimestamp: dailyTimestamp })
        if (word) {
            result[lang] = word.text
        }
    }))
        .then(() => res.send({daily_word: result}))
        .catch(error => utils.internal_server(res, error))
}

function randomWord(req, res) {
    let { lang, length } = req.query
    lang = lang.toLowerCase()
    length = parseInt(length)

    // Error handling
    if (!iso.validate(lang) || !ALLOWED_LANGS.includes(lang)) {
        utils.bad_request(res, "`lang` must follow ISO 3166-1 alpha-2 format.")
        return
    }
    if (isNaN(length) || length < MINIMUM_WORD_LENGTH || length > MAXIMUM_WORD_LENGTH) {
        utils.bad_request(res, `length should be integer, greater than ${MINIMUM_WORD_LENGTH} and lesser than ${MAXIMUM_WORD_LENGTH}.`)
        return
    }

    const Word = getWordModel(lang)

    Word.find({ length: length })
        .then(words => {
            const randomWord = words[Math.floor(Math.random() * words.length)]
            res.send({ word: randomWord.get("text") })
        })
        .catch(error => utils.internal_server(res, error))
}

module.exports = { existsWord, generateDailyWord, getDailyWord, randomWord }
