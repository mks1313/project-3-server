const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    votes: {
        type: Number,
        default: 0,
    },
});

const Comment = model("Comment", commentSchema);
module.exports = Comment;
