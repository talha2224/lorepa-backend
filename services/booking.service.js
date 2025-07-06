const { BookingModel } = require("../models/booking.model");
const { TrailerModel } = require("../models/trailer.model");
const { uploadFile } = require("../utils/function");

const create = async (req, res) => {
  try {
    const {
      country,
      firstname,
      middlename,
      lastname,
      licenseNumber,
      dob,
      expirationDate,
      trailerId,
      startDate,
      endDate,
      price
    } = req.body;

    const files = req.files;

    if (!files?.driverLicenseImage?.[0] || !files?.vehicleInsuraneImage?.[0] || !files?.vehicleRegistrationImage?.[0]) {
      return res.status(400).json({ msg: "All 3 document images are required" });
    }

    const trailer = await TrailerModel.findById(trailerId);
    if (!trailer) return res.status(404).json({ msg: "Trailer not found" });

    const start = new Date(startDate);
    const end = new Date(endDate);
    const driverLicenseImage = await uploadFile(files.driverLicenseImage[0]);
    const vehicleInsuraneImage = await uploadFile(files.vehicleInsuraneImage[0]);
    const vehicleRegistrationImage = await uploadFile(files.vehicleRegistrationImage[0]);

    const booking = await BookingModel.create({
      driverLicenseImage,
      vehicleInsuraneImage,
      vehicleRegistrationImage,
      country,
      firstname,
      middlename,
      lastname,
      licenseNumber,
      dob,
      expirationDate,
      trailerId,
      startDate,
      endDate,
      price
    });

    res.status(200).json({ msg: "Booking created successfully", data: booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error", error: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    const bookings = await BookingModel.find().populate("trailerId").sort({ createdAt: -1 });
    res.status(200).json({ data: bookings });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching bookings", error: err.message });
  }
};

const getSingle = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await BookingModel.findById(id);
    if (!booking) return res.status(404).json({ msg: "Booking not found" });
    res.status(200).json({ data: booking });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching booking", error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await BookingModel.findByIdAndDelete(id);
    res.status(200).json({ msg: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting booking", error: err.message });
  }
};

const changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await BookingModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json({ msg: "Status updated", data: updated });
  } catch (err) {
    res.status(500).json({ msg: "Error updating status", error: err.message });
  }
};

module.exports = {
  create,
  getAll,
  getSingle,
  remove,
  changeStatus,
};
