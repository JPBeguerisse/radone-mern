const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema({
  name: String,
  userName: String,
  email: { type: String, unique: true, lowercase: true, trim: true },
  password: String,
});

module.exports = mongoose.model("PendingUser", pendingUserSchema);
