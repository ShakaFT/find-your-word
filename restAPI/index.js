require('dotenv').config()
const bodyParser = require('body-parser');
const database = require('mongoose')
const express = require("express")
const app = express()

const userRouter = require("./routes/user.router")
const wordRouter = require("./routes/word.router")

app.use(bodyParser.json())

app.get("/", (req, res) => { res.send() })

app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`${res.statusCode} ${req.method} ${req.baseUrl}${req.url}`);
        console.log(`    => ${res.statusMessage}\n`)
    });
    next();
});

app.use("/user", userRouter)
app.use("/word", wordRouter)


database.connect(process.env.DB_CONNECTION)
    .then(() => app.listen(process.env.PORT, () => {
        console.log("REST API is ready !\n")
    }))
    .catch(err => {
        console.error(`Error during database connection process : ${err}`)
    })
