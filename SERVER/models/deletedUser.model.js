// models/deletedUser.model.ts ou .js
const mongoose = require("mongoose");

const deletedUserSchema = new mongoose.Schema(
  {
    originalId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ancien _id
    userName: String,
    email: String,
    picture: String,
    deletedAt: { type: Date, default: Date.now }, // date de suppression
  },
  { timestamps: true }
);

const DeletedUserModel = mongoose.model("DeletedUser", deletedUserSchema);

module.exports = DeletedUserModel;
