const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
    trailerId: { type: mongoose.Schema.Types.ObjectId, ref: "Trailer", required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, default: "pending" },
    createdAt: { type: Date, default: Date.now }
});

const BookingModel = mongoose.model("Booking", bookingSchema, "Booking");

module.exports = { BookingModel };
