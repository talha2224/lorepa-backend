const express = require("express")
const cors = require("cors")
const dbConnection = require("./config/db.config")
const combineRouter = require("./routers/index")

require("dotenv").config()





const app = express()
const port = process.env.PORT || 3002
app.use(express.json())
app.use(cors({ origin: "*" }))
app.use("/api/v1", combineRouter)
dbConnection();

// app.post("/create-checkout-session", async (req, res) => {
//     try {
//         const { amount } = req.body;

//         const session = await stripe.checkout.sessions.create({payment_method_types: ["card"],line_items: [{price_data: {currency: "usd",product_data: {name: "Money Transfer",},unit_amount: amount * 100,},quantity: 1,},],mode: "payment",success_url: `https://ngoc-dashboard.netlify.app/dashboard/home?query=success`,cancel_url: `https://ngoc-dashboard.netlify.app/dashboard/home?query=failed`,});
//         res.json({ url: session.url });
//     } 
//     catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
//     const sig = req.headers["stripe-signature"];
//     let event;

//     try {
//         event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
//     } catch (err) {
//         return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     if (event.type === "checkout.session.completed") {
//         const session = event.data.object;

//         // Send success API request
//         await fetch(`${process.env.BASE_URL}/transfer/create`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 userId: session.client_reference_id,
//                 amount: session.amount_total / 100,
//             }),
//         });
//     }

//     res.json({ received: true });
// });


app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})
