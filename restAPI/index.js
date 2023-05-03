const express = require("express")
const app = express()

app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`${res.statusCode} ${req.method} ${req.url}`);
        console.log(`    => ${res.statusMessage}\n`)
    });
    next();
});

app.get("/", (req, res) => {
    res.send({ success: true })
})

app.listen(8080, () => {
    console.log("REST API is ready !\n")
})
