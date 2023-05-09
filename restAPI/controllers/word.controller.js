const iso = require('iso-639-1');
const Word = require('../models/word.model')
const utils = require('../utils')

function existsWord(req, res) {
    const { lang, word } = req.body;

    // Error handling
    if (!iso.validate(lang)) {
        utils.bad_request(res, "`lang` must follow ISO 3166-1 alpha-2 format.")
        return
    }
    if (typeof word !== "string") {
        utils.bad_request(res, "`word` should be String.")
        return
    }

    const query = {}
    query[`${lang}.text`] = word.toUpperCase()

    Word.find(query)
        .then(words => res.send({exists: words.length > 0}))
        .catch(error => utils.internal_server(res, error))
}

function randomWord(req, res) {
    const { lang, length } = req.body;

    // Error handling
    if (!iso.validate(lang)) {
        utils.bad_request(res, "`lang` must follow ISO 3166-1 alpha-2 format.")
        return
    }
    if (!Number.isInteger(length) || length < 4) {
        utils.bad_request(res, "`length` should be integer and greater than 4.")
        return
    }

    const query = {}
    query[`${lang}.length`] = length
    const projection = { [`${lang}.text`]: 1 };

    Word.find(query, projection)
        .then(words => {
            const randomWord = words[Math.floor(Math.random()*words.length)]
            console.log(randomWord.get(lang))
            res.send({word: randomWord.get(lang).text})
        })
        .catch(error => utils.internal_server(res, error))
}

module.exports = { existsWord, randomWord }
