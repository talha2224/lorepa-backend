const router = require("express").Router();
const { create, getAll, getSingle, remove, changeStatus, getAllForBuyer, getAllForSeller } = require("../services/booking.service");

router.post("/create", create);
router.get("/all", getAll);
router.get("/buyer/:id", getAllForBuyer);
router.get("/seller/:id", getAllForSeller);
router.get("/single/:id", getSingle);
router.delete("/delete/:id", remove);
router.put("/status/:id", changeStatus);

module.exports = router;
