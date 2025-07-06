const combineRouter = require("express").Router()


combineRouter.use("/account",require("./account.router"))
combineRouter.use("/trailer",require("./trailer.router"))
combineRouter.use("/booking",require("./booking.router"))
combineRouter.use("/dashboard",require("./dashboard.router"))
combineRouter.use("/content", require("./content.router"));





module.exports = combineRouter