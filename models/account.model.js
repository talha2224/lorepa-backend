const mongoose = require("mongoose");

const AccountSchema = mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['owner', 'renter'], required: true },
  accountBlocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const AccountModel = mongoose.model("Account", AccountSchema, "Account");

module.exports = { AccountModel };
