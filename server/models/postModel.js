const mongoose = require("mongoose");
const {DateTime} = require("luxon");

const PostModel = new mongoose.Schema({
    title: {type: String, required: true, maxLength: 200},
    timestamp: {type: Date, required: true, default: Date.now()},
    body: {type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    likes: {
        number: {type: Number, default: 1},
        users: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]
    }
})


PostModel.virtual("timestamp_format").get(function() {
    return DateTime.fromJSDate(this.timestamp).toFormat("M/d/yy h:mm a");
})

PostModel.virtual("url").get(function() {
    return `/blog/${this._id}`;
})

// if you plug in a user id it will tell you if they have liked the post
PostModel.methods.likedByUser = function (userId) {
    return this.likes.users.includes(userId);
};

module.exports = mongoose.model("Posts", PostModel);