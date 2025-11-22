const router = require("express").Router()
// const { multipleupload } = require("../config/multer.config")
const { createAccount, loginAccount, getAccountById, getAllAccount, deleteAccount,reactivateAccount, dashboardData} = require("../services/account.service")

router.post("/register",createAccount)
router.post("/login",loginAccount)
router.delete("/delete/account/:id",deleteAccount)
router.put("/reactivate/account/:id",reactivateAccount)
router.get("/single/:id",getAccountById)
router.get("/details/:id",dashboardData)
router.get("/all",getAllAccount)



module.exports = router
