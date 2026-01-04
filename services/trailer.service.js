const { TrailerModel } = require("../models/trailer.model");
const { uploadFile } = require("../utils/function");
const { createNotification } = require("./notification.service");

const create = async (req, res) => {
  try {
    const {
  latitude,
  longitude,
  userId,
  title,
  category,
  description,
  zip,
  dailyRate,
  depositRate,
  city,
  country,
  closedDates,
  hitchType,
  lightPlug,
  weightCapacity,
  make,
  model,
  year,
  length,
  ballSize,
  dimensions
} = req.body;
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ msg: "At least 1 image is required" });
    }
    if (files.length > 4) {
      return res.status(400).json({ msg: "Maximum 4 images allowed" });
    }
    const imageUrls = await Promise.all(
      files.map((file) => uploadFile(file))
    );
    const trailer = await TrailerModel.create({ latitude, longitude, userId, title, category, description, zip, dailyRate, depositRate, closedDates, city, country, images: imageUrls,hitchType,
  lightPlug,
  weightCapacity,
  make,
  model,
  year,
  length,
  ballSize,
  dimensions });
    await createNotification({
      userId,
      title: "Trailer Listing Submitted",
      description: "Your trailer listing request has been sent to the admin for approval."
    });
    return res.status(200).json({ msg: "Trailer created successfully", data: trailer, status: 200 });
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
const getAllApproved = async (req, res) => {
  try {
    const trailers = await TrailerModel.find({ status: "approved" }).populate("userId");
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
const getAllBySeller = async (req, res) => {
  try {
    const { id } = req.params;
    const trailer = await TrailerModel.find({ userId: id })
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
    if(updated){
      await createNotification({
        userId: updated.userId,
        title: `Trailer ${status}`,
        description: `Your trailer "${updated.title}" status has been updated to ${status}.`
      });
      res.status(200).json({ msg: "Status updated", data: updated });

    }
  } catch (err) {
    res.status(500).json({ msg: "Error updating status" });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      latitude,
      longitude,
      title,
      category,
      description,
      zip,
      dailyRate,
      depositRate,
      city,
      country,
      closedDates,
      existingImages, // array of image URLs that the user wants to keep
    } = req.body;

    const trailer = await TrailerModel.findById(id);
    if (!trailer) return res.status(404).json({ msg: "Trailer not found" });

    // Start with existing images on the DB
    let newImages = trailer.images || [];

    // Keep only images that user wants to retain
    if (Array.isArray(existingImages)) {
      newImages = newImages.filter(img => existingImages.includes(img));
    } else {
      // If no existingImages provided, assume user wants to remove all old images
      newImages = [];
    }

    // Upload new images if provided
    if (req.files && req.files.length > 0) {
      if (newImages.length + req.files.length > 4) {
        return res.status(400).json({ msg: "Maximum 4 images allowed" });
      }

      const uploaded = await Promise.all(req.files.map(file => uploadFile(file)));
      newImages = [...newImages, ...uploaded];
    }

    // Update trailer fields
    trailer.latitude = latitude ?? trailer.latitude;
    trailer.longitude = longitude ?? trailer.longitude;
    trailer.title = title ?? trailer.title;
    trailer.category = category ?? trailer.category;
    trailer.description = description ?? trailer.description;
    trailer.zip = zip ?? trailer.zip;
    trailer.dailyRate = dailyRate ?? trailer.dailyRate;
    trailer.depositRate = depositRate ?? trailer.depositRate;
    trailer.city = city ?? trailer.city;
    trailer.country = country ?? trailer.country;
    trailer.closedDates = closedDates ?? trailer.closedDates;
    trailer.images = newImages;

    await trailer.save();

    res.status(200).json({ msg: "Trailer updated successfully", data: trailer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong", error: err.message });
  }
};


module.exports = {
  create,
  getAll,
  getSingle,
  remove,
  changeStatus,
  getAllApproved,
  getAllBySeller,
  update
};
