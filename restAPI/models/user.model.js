const database = require("mongoose")

const userSchema = new database.Schema({
    email: {
        type: string,
        required: true,
        unique: true
    },
    password: {
        type: string,
        required: true
    },
    username: {
        type: string,
        required: true,
        unique: true
    }
});

const User = database.model("users", userSchema)
module.exports = User
