const mongoose = require("mongoose");
const z = require("zod");

const UserSchema = new mongoose.Schema({
  username: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  images: {
    type: [String],
    default: [],
  },
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(15),
});

const SignupSchema = z.object({
  username: z.string().max(15),
  email: z.string().email(),
  password: z.string().min(6).max(15),
});

const User = mongoose.model("user", UserSchema);

module.exports = { User, LoginSchema, SignupSchema };
