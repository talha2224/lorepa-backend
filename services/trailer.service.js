const { TrailerModel } = require("../models/trailer.model");
const { uploadFile } = require("../utils/function");
const { createNotification } = require("./notification.service");

const create = async (req, res) => {
  try {
    const { latitude, longitude, userId, title, category, description, zip, dailyRate, depositRate, city, country, closedDates } = req.body;
    const files = req.files;
    console.log(files, 'files')
    if (!files || files.length === 0) {
      return res.status(400).json({ msg: "At least 1 image is required" });
    }
    if (files.length > 4) {
      return res.status(400).json({ msg: "Maximum 4 images allowed" });
    }
    const imageUrls = await Promise.all(
      files.map((file) => uploadFile(file))
    );
    const trailer = await TrailerModel.create({ latitude, longitude, userId, title, category, description, zip, dailyRate, depositRate, closedDates, city, country, images: imageUrls, });
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
    const { latitude, longitude, title, category, description, zip, dailyRate, depositRate, city, country, closedDates, existingImages } = req.body;
    let trailer = await TrailerModel.findById(id);
    if (!trailer) return res.status(404).json({ msg: "Trailer not found" });

    // Handle images
    let newImages = trailer.images || [];

    // Remove images that user deleted
    if (existingImages) {
      newImages = newImages.filter(img => existingImages.includes(img));
    } else {
      newImages = [];
    }

    // Upload new images if provided
    if (req.files && req.files.length > 0) {
      if (newImages.length + req.files.length > 4)
        return res.status(400).json({ msg: "Maximum 4 images allowed" });

      const uploaded = await Promise.all(req.files.map(file => uploadFile(file)));
      newImages = [...newImages, ...uploaded];
    }

    // Update trailer
    trailer.latitude = latitude;
    trailer.longitude = longitude;
    trailer.title = title;
    trailer.category = category;
    trailer.description = description;
    trailer.zip = zip;
    trailer.dailyRate = dailyRate;
    trailer.depositRate = depositRate;
    trailer.city = city;
    trailer.country = country;
    trailer.closedDates = closedDates;
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
