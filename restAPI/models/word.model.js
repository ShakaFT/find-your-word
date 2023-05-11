const database = require("mongoose")

const wordSchema = new database.Schema({
    length: {
        type: Number,
        required: true
    },
    text: {
        type: String,
        required: true,
        unique: true
    },
    dailyTimestamp: {
        type: Number
    }
});

function getWordModel(lang) {
    return database.model(`${lang}_words`, wordSchema)
}

module.exports = { getWordModel }
