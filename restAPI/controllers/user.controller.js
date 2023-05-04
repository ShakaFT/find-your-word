const User = require('../models/user.model')
const utils = require('../utils')

function createUser(req, res) {
    const { email, password, username } = req.body;

    // Error handling
    if (typeof email !== "string") {
        utils.bad_request(res, "`email` should be String")
        return
    }
    if (typeof password !== "string") {
        utils.bad_request(res, "`password` should be String")
        return
    }
    if (typeof username !== "string") {
        utils.bad_request(res, "`username` should be String")
        return
    }

    User.create({ email: email, password: password, username: username })
        .then(user => res.send({ id: doc._id }))
}

function deleteUser(req, res) {
    const userId = req.params.id
    const { password } = req.body;

    // Error handling
    if (typeof password !== "string") {
        utils.bad_request(res, "`password` should be String")
        return
    }

    User.findById(userId)
        .then(user => {
            const success = user.password === password
            if (user.password !== password) {
                res.send({ success: false })
            }
            User.findByIdAndDelete(userId)
                .then(res.send({ success: true }))
        })
}

function getUser(req, res) {
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

function updatePasswordUser(req, res) {
    const { password } = req.body;

    // Error handling
    if (typeof password !== "string") {
        utils.bad_request(res, "`password` should be String")
        return
    }

    User.findByIdAndUpdate(req.params.id, { password: password })
        .then(res.status(204).send())
}

function updateProfileUser(req, res) {
    const { email, username } = req.body;

    // Error handling
    if (typeof email !== "string") {
        utils.bad_request(res, "`email` should be String")
        return
    }
    if (typeof username !== "string") {
        utils.bad_request(res, "`username` should be String")
        return
    }

    User.findByIdAndUpdate(req.params.id, { email: email, username: username })
        .then(res.status(204).send())
}

module.exports = { createUser, deleteUser, getUser, updatePasswordUser, updateProfileUser }
