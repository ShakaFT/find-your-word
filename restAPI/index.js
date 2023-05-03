require('dotenv').config()
const bodyParser = require('body-parser');
const database = require('mongoose')
const express = require("express")
const app = express()

const userRouter = require("./routes/user.router")

app.use(bodyParser.json())

app.use("/user", userRouter)

app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`${res.statusCode} ${req.method} ${req.url}`);
        console.log(`    => ${res.statusMessage}\n`)
    });
    next();
});


app.get("/", (req, res) => {res.status(204).send()})


database.connect(process.env.DB_CONNECTION)
    .then(() => app.listen(8080, () => {
        console.log("REST API is ready !\n")
    }))
    .catch(err => {
        console.error(`Error during database connection process : ${err}`)
    })
