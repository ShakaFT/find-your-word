const iso = require('iso-639-1')
const { getWordModel } = require('../models/word.model')
const utils = require('../utils')

function existsWord(req, res) {
    const wordRegex = /^[a-zA-Z]+$/
    const { lang, word } = req.query

    // Error handling
    if (!iso.validate(lang)) {
        utils.bad_request(res, "`lang` must follow ISO 3166-1 alpha-2 format.")
        return
    }
    if (!wordRegex.test(word) || !word) {
        utils.bad_request(res, "`word` should be String.")
        return
    }

    const Word = getWordModel(lang)

    Word.find({ text: word.toUpperCase() })
        .then(words => res.send({ exists: words.length > 0 }))
        .catch(error => utils.internal_server(res, error))
}

function randomWord(req, res) {
    let { lang, length } = req.query
    length = parseInt(length)

    // Error handling
    if (!iso.validate(lang)) {
        utils.bad_request(res, "`lang` must follow ISO 3166-1 alpha-2 format.")
        return
    }
    if (isNaN(length) || length < 4) {
        utils.bad_request(res, "`length` should be integer and greater than 3.")
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

module.exports = { existsWord, randomWord }
