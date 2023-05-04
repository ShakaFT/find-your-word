const database = require("mongoose")

const wordSchema = new database.Schema({
    lang: {
        type: new database.Schema({
            length: {
                type: Number,
                required: true
            },
            text: {
                type: String,
                required: true
            }
        }),
        required: true,
        unique: true
    },
});

const Word = database.model("words", wordSchema)
module.exports = Word
