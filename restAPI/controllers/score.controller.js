const constants = require('../constants')
const iso = require('iso-639-1')
const Score = require('../models/score.model')
const utils = require('../utils/utils')

function createScore(req, res) {
    let { lang, timestamp, tries, username } = req.body
    timestamp = parseInt(timestamp)
    tries = parseInt(tries)

    // Error handling
    if (!iso.validate(lang) || !constants.ALLOWED_LANGS.includes(lang)) {
        utils.bad_request(res, "`lang` must follow ISO 3166-1 alpha-2 format.")
        return
    }
    if (isNaN(timestamp)) {
        utils.bad_request(res, "`timestamp` should be integer")
        return
    }
    if (isNaN(tries)) {
        utils.bad_request(res, "`tries` should be integer")
        return
    }
    if (typeof username !== "string") {
        utils.bad_request(res, "`username` should be string")
        return
    }

    Score.findOne({
        $and: [
            { dailyTimestamp: timestamp },
            { lang: lang },
            { username: username }
        ]
    })
        .then(score => {
            if (score) {
                utils.bad_request(res, `Timestamp ${timestamp} already exist for user ${username} with lang ${lang}`)
                return
            }
            Score.create({ dailyTimestamp: timestamp, lang: lang, tries: tries, username: username })
                .then(res.status(204).send())
                .catch(error => utils.internal_server(res, error))
        })
        .catch(error => utils.internal_server(res, error))
}

function getScore(req, res) {
    let { lang, timestamp, username } = req.query
    timestamp = parseInt(timestamp)

    // Error handling
    if (!iso.validate(lang) || !constants.ALLOWED_LANGS.includes(lang)) {
        utils.bad_request(res, "`lang` must follow ISO 3166-1 alpha-2 format.")
        return
    }
    if (isNaN(timestamp)) {
        utils.bad_request(res, "`timestamp` should be integer")
        return
    }
    if (typeof username !== "string") {
        utils.bad_request(res, "`username` should be string")
        return
    }

    Score.find({ dailyTimestamp: timestamp, lang: lang }, { _id: 0, tries: 1, username: 1 })
        .sort({ tries: 1 })
        .limit(constants.NB_BEST_SCORES)
        .then(bestScores => {
            Score.findOne({ dailyTimestamp: timestamp, username: username }, { _id: 0, tries: 1, username: 1 })
                .then(score => {
                    const result = { best_scores: bestScores }
                    if (score) {
                        result["personal_score"] = score
                    }
                    res.send(result)
                })
                .catch(error => utils.internal_server(res, error))
        })
        .catch(error => utils.internal_server(res, error))
}

module.exports = { createScore, getScore }
