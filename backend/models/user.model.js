import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [4, "First name must be at least 4 characters"],
    },
    lastname: {
      type: String,
      required: true,
      minlength: [4, "Last name must be at least 4 characters"],
    },
  },
  email: {
    type: String,
    required: true,
    minlength: [5, "Email must be at least 5 characters"],
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: [8, "Password must be at least 8 characters"],
  },

  socketId: {
    type: String,
  }, 
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const UserModel = mongoose.model("users", userSchema);

export default UserModel;
