require('dotenv').config()
const bodyParser = require('body-parser');
const cors = require('cors')
const database = require('mongoose')
const express = require("express")
const app = express()

const userRouter = require("./routes/user.router")
const wordRouter = require("./routes/word.router")

app.use(bodyParser.json())
app.use(cors({
    origin: '*'
}))

app.get("/", (req, res) => { res.send() })

app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`${res.statusCode} ${req.method} ${req.baseUrl}${req.url}`);
        console.log(`    => ${res.statusMessage}\n`)
    })
    next()
});

app.use((req, res, next) => {
    // Check API KEY
    if (req.headers.api_key !== process.env.API_KEY) {
        res.status(401).send({ error: "You are not authorized to use this endpoint" })
        return
    }
    next()
});

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
