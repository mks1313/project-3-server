const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    content: {
      type: String,
      required: false,
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
  });

  const Comment = model("Comment", commentSchema);

module.exports = Comment;