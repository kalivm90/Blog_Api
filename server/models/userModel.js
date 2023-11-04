const mongoose = require("mongoose")
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    firstName: {type: String, required: true, maxLength: 100},
    lastName: {type: String, required: true, maxLength: 100},
    username: {
        type: String, 
        required: function() {
            return !this.googleId;
        }
    },
    email: {type: String, required: true},
    googleId: {type: String},
    blogOwner: {type: Boolean, default: true},
    password: {type: String, required: true},
})

UserSchema.pre(
    "save", 
    async function(next) {
        const user = this; 
        const hash = await bcrypt.hash(this.password, 10); 

        this.password = hash; 
        next();
    }
);

UserSchema.methods.isValidPassword = async function(password) {
    const user = this; 
    const compare = await bcrypt.compare(password, user.password);

    return compare;
}

UserSchema.virtual("fullname").get(function (){
    return `${this.firstName} ${this.lastName}`;
})

UserSchema.virtual("userObj").get(function() {
    return {
        _id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        username: this.username,
    }
})

UserSchema.virtual("url").get(function (){
    return `/profile/${this._id}`;
})

module.exports = mongoose.model("User", UserSchema);