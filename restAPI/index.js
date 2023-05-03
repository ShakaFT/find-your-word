require('dotenv').config()
const database = require('mongoose')
const express = require("express")
const app = express()


app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`${res.statusCode} ${req.method} ${req.url}`);
        console.log(`    => ${res.statusMessage}\n`)
    });
    next();
});


app.get("/", (req, res) => {res.status(204)})


app.get("/user", (req, res) => {
    const schema = database.Schema({
        field: { type: String, required: true },
    })
    database.model("users", schema).findById("64521d8db0e267ec82ebbd1f").then(user => res.send({ user }))
})


database.connect(process.env.DB_CONNECTION)
    .then(() => app.listen(8080, () => {
        console.log("REST API is ready !\n")
    }))
    .catch(err => {
        console.error(`Error during database connection process : ${err}`)
    })
