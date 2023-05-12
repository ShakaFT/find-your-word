require('dotenv').config()
const bodyParser = require('body-parser');
const constants = require("./constants")
const cors = require('cors')
const database = require('mongoose')
const express = require("express")
const utils = require('./utils')

const app = express()

const userRouter = require("./routes/user.router")
const wordRouter = require("./routes/word.router");

app.use(bodyParser.json())
app.use(cors({
    origin: '*'
}))


app.get("/", (req, res) => { res.send() })


app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`${res.statusCode} ${req.method} ${req.baseUrl}${req.url}`);
        if (res.statusCode >= 500 && res.statusCode <= 599 && process.env.PRODUCTION) {
            utils.discordMessage(req.method, req.originalUrl, res.statusCode)
        }
    })
    next()
});

app.use((req, res, next) => {
    // Check API KEY
    if (req.headers["api-key"] !== process.env.API_KEY) {
        utils.unauthorized(res)
        return
    }
    next()
});

app.get("/start", (req, res) => {
    res.send({
        allowed_langs: constants.ALLOWED_LANGS,
        maximum_word_length: constants.MAXIMUM_WORD_LENGTH,
        minimum_daily_timestamp: constants.MINIMUM_DAILY_TIMESTAMP,
        minimum_word_length: constants.MINIMUM_WORD_LENGTH
    })
})
app.get("/error", (req, res) => {
    res.status(500).send()
})
app.use("/user", userRouter)
app.use("/word", wordRouter)

if (require.main === module) {
    database.connect(process.env.DB_CONNECTION)
        .then(() => app.listen(process.env.PORT, () => {
            console.log("REST API is ready !\n")
        }))
        .catch(err => {
            console.error(`Error during database connection process : ${err}`)
        })
}

module.exports = app;
