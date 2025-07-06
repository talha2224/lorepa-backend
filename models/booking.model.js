const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    trailerId: { type: mongoose.Schema.Types.ObjectId, ref: "Trailer", required: true },
    driverLicenseImage: { type: String, required: true },
    country: { type: String, required: true },
    firstname: { type: String, required: true },
    middlename: { type: String, required: true },
    lastname: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    dob: { type: String, required: true },
    expirationDate: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    expirationDate: { type: String, required: true },
    vehicleInsuraneImage: { type: String, required: true },
    vehicleRegistrationImage: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now }
});

const BookingModel = mongoose.model("Booking", bookingSchema, "Booking");

module.exports = { BookingModel };
