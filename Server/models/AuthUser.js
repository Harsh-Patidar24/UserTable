const mongoose = require("mongoose")

const AuthUserSchema = new mongoose.Schema({
    email:{
        type: "String",
        required: true,
        unique: true
    },
    password:{
        type:"String",
        required: true,
        unique: true
    }
})
module.exports = mongoose.model("User", AuthUserSchema);
