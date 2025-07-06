const router = require("express").Router();
const { create, getAll, getSingle, remove, changeStatus } = require("../services/trailer.service");
const { multipleupload } = require("../config/multer.config");

router.post("/create", multipleupload.array('images',4), create);
router.get("/all", getAll);
router.get("/single/:id", getSingle);
router.delete("/delete/:id", remove);
router.put("/status/:id", changeStatus);

module.exports = router;
