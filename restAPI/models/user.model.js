const database = require("mongoose")

const userSchema = new database.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    }
});

const User = database.model("users", userSchema)
module.exports = User
