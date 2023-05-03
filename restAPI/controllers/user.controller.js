const User = require('../models/user.model')

function login(req, res) {
    const {email, password} = req.body;
    User.find({email: email})
        .then(users => {
            const user = users[0]
            result = {"login": user ? user.password === password : false}
            if (user) {
                result.user = user
            }
            res.send(result)
        })
}

module.exports = { login }
