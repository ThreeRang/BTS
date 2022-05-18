const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    _id: {
      type: String,
    },
    name: {
      type: String,
      maxlength: 50,
      default: "none",
    },
    email: {
      type: String,
      maxlength: 100,
      default: "none",
    },
    role: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
