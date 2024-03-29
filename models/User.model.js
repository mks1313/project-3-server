const { Schema, model } = require("mongoose");

const defaultImageURL =
  "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?w=1380&t=st=1708174521~exp=1708175121~hmac=d2cfc9d89863321487de573e2cb6b6bc649bf88276a1f16d9e41be53a9b5091e";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    profileImage: {
      type: String,
      default: defaultImageURL,
    },
    isOwner: {
      type: Boolean,
      default: false,
    },
    sex: {
      type: String,
      enum: ["male", "female", "N/A"], 
      default: "N/A",
    },
    birthday: {
      type: Date,
      default: Date.now,
    },
    restaurant: [{
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
    }],
    favorites: [{
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
    }],
    comments: [{
      type: Schema.Types.ObjectId,
      ref: "Comment",
    }],
    ratings: [{
      type: Schema.Types.ObjectId,
      ref: "Rating",
    }]
  },
  
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
