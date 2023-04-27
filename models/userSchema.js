const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    code: String,
});

// const uberModel = new mongoose.Schema({
//     username: String,
//     password: String,
// });

module.exports = mongoose.model("user",userModel);