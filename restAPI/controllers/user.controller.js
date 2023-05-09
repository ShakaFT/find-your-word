const database = require("mongoose")
const User = require('../models/user.model')
const utils = require('../utils')

function createUser(req, res) {
    const { email, password, username } = req.body

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

    User.findOne({ $or: [{ email: email }, { username: username }] })
        .then(user => {
            if (user) {
                res.send({ email_exists: user.email === email, username_exists: user.username === username })
                return
            }
            User.create({ email: email, password: password, username: username })
                .then(user => res.send({ user_id: user._id, email_exists: false, username_exists: false }))
                .catch(error => utils.internal_server(res, error))
        })
        .catch(error => utils.internal_server(res, error))
}

function deleteUser(req, res) {
    const { password } = req.body
    const userId = req.params.id

    // Error handling
    if (typeof password !== "string") {
        utils.bad_request(res, "`password` should be String")
        return
    }
    if (!database.Types.ObjectId.isValid(userId)) {
        utils.bad_request(res, `Invalid user id : ${userId}`)
        return
    }

    User.findById(userId)
        .then(user => {
            if (!user) {
                utils.bad_request(res, `There is no user with uid : ${userId}`)
                return
            }
            if (user.password !== password) {
                res.send({ success: false })
                return
            }
            User.findByIdAndDelete(userId)
                .then(res.send({ success: true }))
                .catch(error => utils.internal_server(res, error))
        })
        .catch(error => utils.internal_server(res, error))
}

function loginUser(req, res) {
    const { email, password } = req.body

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
                result.user = {
                    id: user._id,
                    email: user.email,
                    username: user.username
                }
            }
            res.send(result)
        })
        .catch(error => utils.internal_server(res, error))
}

function updatePasswordUser(req, res) {
    const { old_password, new_password } = req.body
    const userId = req.params.id

    // Error handling
    if (!database.Types.ObjectId.isValid(userId)) {
        utils.bad_request(res, `Invalid user id : ${userId}`)
        return
    }
    if (typeof old_password !== "string") {
        utils.bad_request(res, "`old_password` should be String")
        return
    }
    if (typeof new_password !== "string") {
        utils.bad_request(res, "`new_password` should be String")
        return
    }

    User.findById(userId)
        .then(user => {
            if (!user) {
                utils.bad_request(res, `There is no user with uid : ${userId}`)
                return
            }
            if (user.password !== old_password) {
                res.send({ success: false })
                return
            }
            User.findByIdAndUpdate(userId, { password: new_password })
                .then(res.send({ success: true }))
                .catch(error => utils.internal_server(res, error))
        })
        .catch(error => utils.internal_server(res, error))
}

function updateProfileUser(req, res) {
    const { email, password, username } = req.body
    const userId = req.params.id

    // Error handling
    if (!database.Types.ObjectId.isValid(userId)) {
        utils.bad_request(res, `Invalid user id : ${userId}`)
        return
    }
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

    User.findById(userId)
        .then(user => {
            if (!user) {
                utils.bad_request(res, `There is no user with uid : ${userId}`)
                return
            }
            if (user.password !== password) {
                res.send({ success: false })
                return
            }
            User.findByIdAndUpdate(userId, { email: email, username: username })
                .then(res.send({ success: true }))
                .catch(error => utils.internal_server(res, error))
        })
        .catch(error => utils.internal_server(res, error))
}

module.exports = { createUser, deleteUser, loginUser, updatePasswordUser, updateProfileUser }
