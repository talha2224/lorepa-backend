const { TrailerModel } = require("../models/trailer.model");
const { uploadFile } = require("../utils/function");

const create = async (req, res) => {
  try {
    const {userId,title,category,make,model,description,year,length,sleeps,address,city,state,zip,dailyRate,weeklyRate,monthlyRate,cleaningRate,securityRate,insuranceDeductible,} = req.body;
    const files = req.files;
    console.log(files,'files')

    if (!files || files.length === 0) {
      return res.status(400).json({ msg: "At least 1 image is required" });
    }

    if (files.length > 4) {
      return res.status(400).json({ msg: "Maximum 4 images allowed" });
    }

    const imageUrls = await Promise.all(
      files.map((file) => uploadFile(file))
    );

    const trailer = await TrailerModel.create({ userId, title, category, make, model, description, year, length, sleeps, address, city, state, zip, dailyRate, weeklyRate, monthlyRate, cleaningRate, securityRate, insuranceDeductible, images: imageUrls,});

    return res.status(200).json({ msg: "Trailer created successfully", data: trailer,status:200});
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ msg: "Something went wrong", error: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    const trailers = await TrailerModel.find().populate("userId");
    res.status(200).json({ data: trailers });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching trailers" });
  }
};

// Get Single Trailer
const getSingle = async (req, res) => {
  try {
    const { id } = req.params;
    const trailer = await TrailerModel.findById(id).populate("userId");
    if (!trailer) return res.status(404).json({ msg: "Trailer not found" });
    res.status(200).json({ data: trailer });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching trailer" });
  }
};

// Delete Trailer
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await TrailerModel.findByIdAndDelete(id);
    res.status(200).json({ msg: "Trailer deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting trailer" });
  }
};

// Change Status
const changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await TrailerModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.status(200).json({ msg: "Status updated", data: updated });
  } catch (err) {
    res.status(500).json({ msg: "Error updating status" });
  }
};

module.exports = {
  create,
  getAll,
  getSingle,
  remove,
  changeStatus,
};
