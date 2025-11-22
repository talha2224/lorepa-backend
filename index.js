const express = require("express")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")
const dbConnection = require("./config/db.config")
const combineRouter = require("./routers/index")
const axios = require("axios")
const Message = require("./models/message.model")
const Chat = require("./models/chat.model")
require("dotenv").config()

const app = express()
const port = process.env.PORT || 3002

app.use(express.json())
app.use(cors({ origin: "*" }))
app.use("/api/v1", combineRouter)

dbConnection()

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'YOUR_GOOGLE_API_KEY'
app.get('/api/autocomplete', async (req, res) => {
  try {
    const { input } = req.query
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/autocomplete/json',
      { params: { input, key: GOOGLE_API_KEY, language: 'en' } }
    )
    return res.json(response.data)
  } catch (err) {
    res.status(500).send('Error fetching autocomplete')
  }
})

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: "*" } })
app.set("io", io)

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("joinChat", (chatId) => {
    socket.join(chatId)
  })

socket.on("sendMessage", async ({ chatId, sender, content }) => {
  try {
    const message = await Message.create({ chatId, sender, content })
    const populatedMessage = await Message.findById(message._id).populate("sender", "name _id")
    io.to(chatId).emit("receiveMessage", populatedMessage)
  } catch (err) {
    console.error("Socket sendMessage error:", err)
  }
})

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
