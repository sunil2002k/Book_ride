import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const captainSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "firstname must be at least 3 character long"],
    },
    lastname: {
      type: String,
      minlength: [3, "lastname must be at least 3 character long"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  password: { type: String, required: true, select: false },
  socketId: { type: String },
  status: { type: String, enum: ["active", "inactive"], default: "inactive" },
  vehicle: {
    color: {
      type: String,
      required: true,
      minlength: [3, "Color must be at least 3 character long"],
    },

    plate: {
      type: String,
      required: true,
      unique: true,
      minlength: [3, "plate  must be at least 3 character long"],
    },

    capacity: {
      type: Number,
      required: true,
      min: [1, "Capacity must be at least 1"],
    },

    vehicleType: {
      type: String,
      required: true,
      enum: ["Bike", "Auto", "Car"],
    },
  },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
});

captainSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

captainSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

captainSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const captainModel = mongoose.model("captain", captainSchema);

export default captainModel;
