const database = require("mongoose")

const scoreSchema = new database.Schema({
    dailyTimestamp: {
        type: Number,
        required: true,
    },
    lang: {
        type: String,
        required: true
    },
    tries: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true,
    }
});

const Score = database.model("scores", scoreSchema)
module.exports = Score
