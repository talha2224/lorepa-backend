const router = require("express").Router();
const { create, getAll, getSingle, remove, changeStatus, getAllApproved, getAllBySeller, update } = require("../services/trailer.service");
const { multipleupload } = require("../config/multer.config");

router.post("/create", multipleupload.array('images',10), create);
router.get("/all", getAll);
router.get("/all/approved", getAllApproved);
router.get("/single/:id", getSingle);
router.get("/seller/:id", getAllBySeller);
router.delete("/delete/:id", remove);
router.put("/status/:id", changeStatus);
router.put("/update/:id", multipleupload.array('images', 4), update);

module.exports = router;
