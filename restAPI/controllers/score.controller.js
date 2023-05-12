const Score = require('../models/score.model')
const utils = require('../utils')

function createScore(req, res) {
    let { timestamp, tries, username } = req.body
    timestamp = parseInt(timestamp)
    tries = parseInt(tries)

    // Error handling
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
            { username: username }
        ]
    })
        .then(score => {
            if (score) {
                utils.bad_request(res, `Timestamp ${timestamp} already exist for user ${username}`)
                return
            }
            Score.create({ dailyTimestamp: timestamp, tries: tries, username: username })
                .then(user => res.status(204).send())
                .catch(error => utils.internal_server(res, error))
        })
        .catch(error => utils.internal_server(res, error))
}

function getScore(req, res) {
    let { timestamp, username } = req.query
    timestamp = parseInt(timestamp)

    // Error handling
    if (isNaN(timestamp)) {
        utils.bad_request(res, "`timestamp` should be integer")
        return
    }
    if (typeof username !== "string") {
        utils.bad_request(res, "`username` should be string")
        return
    }

    Score.find({ dailyTimestamp: timestamp }, { _id: 0, tries: 1, username: 1 })
        .sort({ tries: 1 })
        .limit(10)
        .then(bestScores => {
            Score.findOne({ dailyTimestamp: timestamp, username: username }, { _id: 0, tries: 1, username: 1 })
                .then(score => res.send({
                    best_scores: bestScores,
                    personal_score: score
                }))
                .catch(error => utils.internal_server(res, error))
        })
        .catch(error => utils.internal_server(res, error))
}

module.exports = { createScore, getScore }
