const { model, Schema } = require("mongoose");

const userSchema = new Schema({
    firstName:  String,
    lastName:   String,
    email:      { type: String, unique: true },
    age:        Number,
    address:    String,
    gender:     { type: String, enum: ["male","female"] },
    updatedAt:   String,
    createdAt:   String,
    userRole:   { type: String, enum: ["admin","user"], default: "user"},
    status:     { type: String, enum: ["active","disabled"], default: "active"}
}, {collection: 'Users', versionKey: false})

module.exports  = model("User", userSchema);
