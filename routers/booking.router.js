const router = require("express").Router();
const { create, getAll, getSingle, remove, changeStatus } = require("../services/booking.service");
const { multipleupload } = require("../config/multer.config");

router.post(
  "/create",
  multipleupload.fields([
    { name: "driverLicenseImage", maxCount: 1 },
    { name: "vehicleInsuraneImage", maxCount: 1 },
    { name: "vehicleRegistrationImage", maxCount: 1 },
  ]),
  create
);

router.get("/all", getAll);
router.get("/single/:id", getSingle);
router.delete("/delete/:id", remove);
router.put("/status/:id", changeStatus);

module.exports = router;
