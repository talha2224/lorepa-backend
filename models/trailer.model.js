const mongoose = require("mongoose");

const trailerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    images: { type: Array, default: [] },
    closedDates: { type: Array, default: [] },
    country: { type: String, required: true },
    city: { type: String, required: true },
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    dailyRate: { type: Number, required: true },
    depositRate: { type: Number, default: 0 },
    status: { type: String, default: "Pending" },
    isVisible: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const TrailerModel = mongoose.model("Trailer", trailerSchema, "Trailer");

module.exports = { TrailerModel };
