const constants = require("../constants")
const iso = require('iso-639-1')
const { getWordModel } = require('../models/word.model')
const utils = require('../utils/utils')

function existsWord(req, res) {
    const wordRegex = /^[a-zA-Z]+$/
    let { lang, word } = req.query
    lang = lang.toLowerCase()

    // Error handling
    if (!iso.validate(lang) || !constants.ALLOWED_LANGS.includes(lang)) {
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
    if (req.headers['x-cloudscheduler'] !== "true") {
        utils.unauthorized(res)
        return
    }
    const todayTimestamp = utils.todayTimestamp()

    constants.ALLOWED_LANGS.forEach(lang => {
        const Word = getWordModel(lang)

        Word.countDocuments({
            $and: [
                { dailyTimestamp: { $exists: false } },
                { length: { $gte: constants.MINIMUM_WORD_LENGTH, $lte: constants.MAXIMUM_WORD_LENGTH } }
            ]
        })
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

function getDailyWords(req, res) {
    const result = {}
    constants.ALLOWED_LANGS.forEach(lang => result[lang] = [])

    Promise.all(constants.ALLOWED_LANGS.map(async lang => {
        const Word = getWordModel(lang)
        return Word.find({ dailyTimestamp: { $exists: true } })
            .sort({ dailyTimestamp: -1 })
            .then(words => words.forEach(word => {
                result[lang].push({
                    timestamp: word.dailyTimestamp,
                    word: word.text
                })
            }))
    }))
        .then(() => res.send({ daily_words: result }))
        .catch(error => utils.internal_server(res, error))
}

function randomWord(req, res) {
    let { lang, length } = req.query
    lang = lang.toLowerCase()
    length = parseInt(length)

    // Error handling
    if (!iso.validate(lang) || !constants.ALLOWED_LANGS.includes(lang)) {
        utils.bad_request(res, "`lang` must follow ISO 3166-1 alpha-2 format.")
        return
    }
    if (isNaN(length) || length < constants.MINIMUM_WORD_LENGTH || length > constants.MAXIMUM_WORD_LENGTH) {
        utils.bad_request(res, `length should be integer, greater than ${constants.MINIMUM_WORD_LENGTH} and lesser than ${constants.MAXIMUM_WORD_LENGTH}.`)
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

module.exports = { existsWord, generateDailyWord, getDailyWords, randomWord }
