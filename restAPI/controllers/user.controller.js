const User = require('../models/user.model')
const utils = require('../utils')

function login(req, res) {
    const { email, password } = req.body;

    // Error handling
    if (typeof email !== "string") {
        utils.bad_request(res, "`email` should be String")
        return
    }
    if (typeof password !== "string") {
        utils.bad_request(res, "`password` should be String")
        return
    }

    User.find({ email: email })
        .then(users => {
            const user = users[0]
            result = { "login": user ? user.password === password : false }

            if (result.login) {
                result.user = user
            }
            res.send(result)
        })
}

module.exports = { login }
